import { EventEmitter } from 'events'
import { getAllSquads, upsertDailyPoints, getDailyPoints, getWalletTotalPoints, getAllWalletTotals } from '../db'
import type { Player, SquadRecord } from '../db'
import { pointsForEvent, playerMatches, EventType, POINTS } from './scoring'
import { scoreEmitter } from './txodds/index'
import type { GoalEvent, CardEvent, LineupsEvent } from './txodds/index'

// ── Squad cache (async DB → sync access in event handlers) ────────────────────

let _squadCache: SquadRecord[] = []

export async function refreshSquadCache(): Promise<void> {
  try {
    _squadCache = await getAllSquads()
  } catch (err: unknown) {
    console.error('[scoring] refreshSquadCache failed:', (err as Error).message)
  }
}

// ── Player ID discovery ───────────────────────────────────────────────────────

export interface DiscoveredPlayer {
  txoddsId: number
  name:     string
  team:     string
  events:   string[]
}

const _discovered = new Map<number, DiscoveredPlayer>()

// Populated from the `lineups` stream action (fired pre-game with full rosters).
// Keys are player normativeIds — same number as PlayerId in goal/card events.
const _playerNames = new Map<number, { name: string; team: string }>()

function recordDiscovery(playerId: number, team: string, event: string) {
  if (!_discovered.has(playerId)) {
    const known = _playerNames.get(playerId)
    _discovered.set(playerId, { txoddsId: playerId, name: known?.name ?? '', team: known?.team || team, events: [] })
  }
  const entry = _discovered.get(playerId)!
  if (!entry.name && _playerNames.has(playerId)) entry.name = _playerNames.get(playerId)!.name
  if (!entry.events.includes(event)) entry.events.push(event)
}

export function getDiscoveredPlayers(): DiscoveredPlayer[] {
  return Array.from(_discovered.values()).sort((a, b) => a.team.localeCompare(b.team) || a.txoddsId - b.txoddsId)
}

export function getPlayerNames(): Array<{ txoddsId: number; name: string; team: string }> {
  return Array.from(_playerNames.entries())
    .map(([txoddsId, { name, team }]) => ({ txoddsId, name, team }))
    .sort((a, b) => a.team.localeCompare(b.team) || a.name.localeCompare(b.name))
}

// ── Live state ────────────────────────────────────────────────────────────────

export interface PlayerLiveScore {
  playerId:    string
  name:        string
  position:    string
  country:     string
  goals:       number
  assists:     number
  yellowCards: number
  redCards:    number
  points:      number
}

export interface SquadLiveScore {
  walletAddress: string
  squadName:     string
  totalPoints:   number
  rank:          number
  players:       PlayerLiveScore[]
}

const state: Record<string, Record<string, PlayerLiveScore>> = {}

// ── Live match scores ─────────────────────────────────────────────────────────

export interface MatchLiveScore {
  fixtureId:   string
  homeScore:   number
  awayScore:   number
  minute:      number
  matchStatus: 'live' | 'finished'
}

const matchScores = new Map<string, MatchLiveScore>()

export function applyMatchScore(
  fixtureId:   string,
  score:       string,
  minute:      number,
  matchStatus: 'live' | 'finished' = 'live',
) {
  const parts = score.split(/[-:]/).map(Number)
  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return
  const entry: MatchLiveScore = { fixtureId, homeScore: parts[0], awayScore: parts[1], minute, matchStatus }
  matchScores.set(fixtureId, entry)
  liveScoringEmitter.emit('match-score', entry)
}

export function getMatchScores(): MatchLiveScore[] {
  return Array.from(matchScores.values())
}

// ── Broadcaster ───────────────────────────────────────────────────────────────

export const liveScoringEmitter = new EventEmitter()

async function broadcast() {
  liveScoringEmitter.emit('leaderboard', await buildLeaderboard())
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getOrCreateEntry(wallet: string, player: Player): PlayerLiveScore {
  state[wallet] ??= {}
  state[wallet][player.id] ??= {
    playerId: player.id, name: player.name, position: player.position,
    country: player.country, goals: 0, assists: 0, yellowCards: 0, redCards: 0, points: 0,
  }
  return state[wallet][player.id]
}

function applyEvent(wallet: string, player: Player, event: EventType) {
  const entry = getOrCreateEntry(wallet, player)
  entry.points += pointsForEvent(player, event)
  if (event === 'goal')        entry.goals++
  if (event === 'assist')      entry.assists++
  if (event === 'yellow_card') entry.yellowCards++
  if (event === 'red_card')    entry.redCards++
}

function handleScoringEvent(
  playerName: string,
  teamName:   string,
  event:      EventType,
  label:      string,
  playerId?:  number | null,
) {
  // Resolve name + team from lineup map when the stream event lacks a player name
  let resolvedName = playerName
  let resolvedTeam = teamName
  if (playerId != null && !resolvedName) {
    const known = _playerNames.get(playerId)
    if (known) {
      resolvedName = known.name
      resolvedTeam = resolvedTeam || known.team
    }
  }

  let matched = false
  for (const squad of _squadCache) {
    for (const player of Object.values(squad.squad) as Player[]) {
      if (!player || !playerMatches(player, resolvedName, resolvedTeam, playerId)) continue
      applyEvent(squad.walletAddress, player, event)
      console.log(`[scoring] ${label}: ${player.name} (id=${playerId}) +${pointsForEvent(player, event)}pts`)
      matched = true
    }
  }
  if (matched) broadcast()
}

// ── Wire up TxOdds stream events ──────────────────────────────────────────────

export function startLiveScoring() {
  // Pre-game lineups: build normativeId → name map so goal/card events can resolve names
  scoreEmitter.on('lineups', (e: LineupsEvent) => {
    for (const p of e.players) {
      _playerNames.set(p.normativeId, { name: p.name, team: p.team })
    }
    console.log(`[scoring] lineups: ${e.players.length} players loaded for fixture ${e.fixtureId}`)
  })

  scoreEmitter.on('goal', (e: GoalEvent) => {
    if (e.fixtureId && e.score) applyMatchScore(e.fixtureId, e.score, e.minute, 'live')
    if (e.playerId != null && e.teamName) recordDiscovery(e.playerId, e.teamName, 'goal')
    handleScoringEvent(e.playerName, e.teamName, 'goal', 'GOAL', e.playerId)
  })

  scoreEmitter.on('card', (e: CardEvent) => {
    if (e.playerId != null && e.teamName) recordDiscovery(e.playerId, e.teamName, e.cardType)
    handleScoringEvent('', e.teamName, e.cardType, e.cardType.toUpperCase(), e.playerId)
  })

  scoreEmitter.on('update', (data: { action: string; fixtureId: string; score: string; minute: number }) => {
    if (data.fixtureId && data.score) {
      const finished = data.action === 'full_time' || data.action === 'match_end'
      applyMatchScore(data.fixtureId, data.score, data.minute, finished ? 'finished' : 'live')
      if (finished) snapshotPoints().catch((e) => console.error('[scoring] snapshot failed:', e))
    }
  })

  console.log('[scoring] live scoring started')
}

// ── Daily points snapshot ─────────────────────────────────────────────────────

function todayDate(): string {
  return new Date().toISOString().slice(0, 10)
}

export async function snapshotPoints(date?: string): Promise<void> {
  const d = date ?? todayDate()
  const tasks: Promise<void>[] = []
  for (const [wallet, players] of Object.entries(state)) {
    const playerPoints: Record<string, number> = {}
    for (const [playerId, liveScore] of Object.entries(players)) {
      if (liveScore.points !== 0) playerPoints[playerId] = liveScore.points
    }
    if (Object.keys(playerPoints).length > 0) {
      tasks.push(upsertDailyPoints(wallet, d, playerPoints))
    }
  }
  await Promise.all(tasks)
  console.log(`[scoring] snapshot saved for ${d}: ${tasks.length} wallets`)
}

// Returns today's per-player points for one wallet, merging DB + in-memory.
export async function getWalletDailyPoints(walletAddress: string, date?: string): Promise<Record<string, number>> {
  const d = date ?? todayDate()
  const inMem: Record<string, number> = {}
  for (const [pid, ls] of Object.entries(state[walletAddress] ?? {})) {
    if (ls.points !== 0) inMem[pid] = ls.points
  }
  if (Object.keys(inMem).length > 0) return inMem  // session is live — use live data
  const saved = await getDailyPoints(walletAddress, d)
  return saved?.playerPoints ?? {}
}

// Returns total accumulated per-player points for a wallet across all days.
export async function getWalletAccumulatedPoints(walletAddress: string): Promise<Record<string, number>> {
  const { playerPoints } = await getWalletTotalPoints(walletAddress)
  // Merge with current in-memory session (avoids waiting for next snapshot)
  for (const [pid, ls] of Object.entries(state[walletAddress] ?? {})) {
    if (ls.points !== 0) playerPoints[pid] = (playerPoints[pid] ?? 0) + ls.points
  }
  return playerPoints
}

// Returns total points per wallet across all days (for leaderboard ranking).
export async function getTotalLeaderboard(): Promise<Array<{ walletAddress: string; total: number }>> {
  const dbTotals = await getAllWalletTotals()
  const totalsMap = new Map(dbTotals.map(r => [r.walletAddress, r.total]))
  // Add current session points not yet snapshotted
  for (const [wallet, players] of Object.entries(state)) {
    const sessionPts = Object.values(players).reduce((s, p) => s + p.points, 0)
    totalsMap.set(wallet, (totalsMap.get(wallet) ?? 0) + sessionPts)
  }
  return Array.from(totalsMap.entries()).map(([walletAddress, total]) => ({ walletAddress, total }))
}

// ── Leaderboard builder ───────────────────────────────────────────────────────

export function buildLeaderboard(): SquadLiveScore[] {
  const rows: SquadLiveScore[] = _squadCache.map(squad => {
    const playerEntries = Object.values(state[squad.walletAddress] ?? {})
    const totalPoints   = playerEntries.reduce((s, p) => s + p.points, 0)
    const players = (Object.values(squad.squad) as Player[]).map(p => {
      if (!p) return null
      return state[squad.walletAddress]?.[p.id] ?? {
        playerId: p.id, name: p.name, position: p.position, country: p.country,
        goals: 0, assists: 0, yellowCards: 0, redCards: 0, points: 0,
      }
    }).filter(Boolean) as PlayerLiveScore[]

    return { walletAddress: squad.walletAddress, squadName: squad.squadName, totalPoints, rank: 0, players }
  })

  rows.sort((a, b) => b.totalPoints - a.totalPoints)
  rows.forEach((r, i) => { r.rank = i + 1 })
  return rows
}

export { POINTS }
