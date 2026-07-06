import { EventEmitter } from 'events'
import { getAllSquads } from '../db'
import type { Player, SquadRecord } from '../db'
import { pointsForEvent, playerMatches, EventType, POINTS } from './scoring'
import { scoreEmitter } from './txodds/index'
import type { GoalEvent, CardEvent } from './txodds/index'

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
  team:     string
  events:   string[]
}

const _discovered = new Map<number, DiscoveredPlayer>()

function recordDiscovery(playerId: number, team: string, event: string) {
  if (!_discovered.has(playerId)) _discovered.set(playerId, { txoddsId: playerId, team, events: [] })
  const entry = _discovered.get(playerId)!
  if (!entry.events.includes(event)) entry.events.push(event)
}

export function getDiscoveredPlayers(): DiscoveredPlayer[] {
  return Array.from(_discovered.values()).sort((a, b) => a.team.localeCompare(b.team) || a.txoddsId - b.txoddsId)
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
  matchScores.set(fixtureId, { fixtureId, homeScore: parts[0], awayScore: parts[1], minute, matchStatus })
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
  let matched = false
  for (const squad of _squadCache) {
    for (const player of Object.values(squad.squad) as Player[]) {
      if (!player || !playerMatches(player, playerName, teamName, playerId)) continue
      applyEvent(squad.walletAddress, player, event)
      console.log(`[scoring] ${label}: ${player.name} +${pointsForEvent(player, event)}pts`)
      matched = true
    }
  }
  if (matched) broadcast()
}

// ── Wire up TxOdds stream events ──────────────────────────────────────────────

export function startLiveScoring() {
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
    }
  })

  console.log('[scoring] live scoring started')
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
