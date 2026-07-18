import { EventEmitter } from 'events'
import { getAllSquads, upsertDailyPoints, getDailyPoints, getWalletTotalPoints, getWalletPointsInRange as getWalletPointsInRangeFromDb, getAllWalletTotals } from '../db'
import type { Player, SquadRecord } from '../db'
import { pointsForEvent, playerMatches, EventType, POINTS } from './scoring'
import { scoreEmitter, fetchMatchEvents } from './txodds/index'
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

// ── All-time DB totals cache (buildLeaderboard runs sync on every live event,
// so it can't hit the DB directly — this is refreshed at startup and whenever
// a day rolls over and gets snapshotted) ──────────────────────────────────────

let _dbTotalsCache = new Map<string, number>()

export async function refreshDbTotalsCache(): Promise<void> {
  try {
    const totals = await getAllWalletTotals()
    _dbTotalsCache = new Map(totals.map((t) => [t.walletAddress, t.total]))
  } catch (err: unknown) {
    console.error('[scoring] refreshDbTotalsCache failed:', (err as Error).message)
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

// The in-memory `state` above is only ever added to — nothing was resetting it
// at day boundaries, so once the server had been running past midnight, a
// wallet's "today" points silently became "every point since the process
// started" (bleeding into the leaderboard and getWalletDailyPoints too). Snapshot
// the outgoing day's totals to the DB and wipe the in-memory state before any
// read or event touches it once the calendar date has actually moved on.
let currentStateDate = todayDate()

function rolloverIfNewDay(): void {
  const today = todayDate()
  if (today === currentStateDate) return
  const staleDate = currentStateDate
  currentStateDate = today
  snapshotPoints(staleDate)
    .then(() => refreshDbTotalsCache())
    .catch((e) => console.error('[scoring] rollover snapshot failed:', e))
  for (const wallet of Object.keys(state)) delete state[wallet]
  _appearanceAwarded.clear()
}

// Flat bonus for a squad's player actually appearing in a lineup today.
// Tracked per (wallet, player) so the same player showing up in more than one
// lineups broadcast — or being backfilled again — doesn't double-award it.
// Only used by the *live* path (startLiveScoring / awardAppearanceForMatch)
// where each event is a genuine one-off happening in real time —
// backfillFixtureFromHistory below is a full historical replay instead and
// deliberately avoids this and every other shared in-memory cache, so it can
// be re-run any number of times and always land on the same correct answer.
const _appearanceAwarded = new Set<string>()

function awardAppearance(playerId: number, playerName: string, teamName: string) {
  rolloverIfNewDay()
  let matched = false
  for (const squad of _squadCache) {
    for (const player of Object.values(squad.squad) as Player[]) {
      if (!player || !playerMatches(player, playerName, teamName, playerId)) continue
      const key = `${squad.walletAddress}:${player.id}`
      if (_appearanceAwarded.has(key)) continue
      _appearanceAwarded.add(key)
      applyEvent(squad.walletAddress, player, 'appearance')
      console.log(`[scoring] APPEARANCE: ${player.name} (id=${playerId}) +${pointsForEvent(player, 'appearance')}pts`)
      matched = true
    }
  }
  if (matched) broadcast()
}

// Awards the appearance bonus to every squad player from either side of a
// specific match, by country rather than by lineup/playerId — useful when
// the live lineups feed hasn't (or won't) fire for that fixture.
export function awardAppearanceForMatch(homeTeam: string, awayTeam: string): number {
  rolloverIfNewDay()
  const teams = new Set([homeTeam, awayTeam].map((t) => t.toLowerCase().trim()))
  let awarded = 0
  for (const squad of _squadCache) {
    for (const player of Object.values(squad.squad) as Player[]) {
      if (!player || !teams.has(player.country.toLowerCase().trim())) continue
      const key = `${squad.walletAddress}:${player.id}`
      if (_appearanceAwarded.has(key)) continue
      _appearanceAwarded.add(key)
      applyEvent(squad.walletAddress, player, 'appearance')
      console.log(`[scoring] APPEARANCE (match): ${player.name} (${player.country}) +${pointsForEvent(player, 'appearance')}pts`)
      awarded++
    }
  }
  if (awarded > 0) broadcast()
  return awarded
}

// Re-applies the appearance bonus against every lineup seen so far today —
// for backfilling squads that were built/joined after those lineups events
// already fired, or after this scoring rule shipped. Skips anyone already
// awarded, so it's always safe to run again.
export function backfillAppearancePoints(): number {
  let awarded = 0
  for (const [playerId, info] of _playerNames.entries()) {
    const before = _appearanceAwarded.size
    awardAppearance(playerId, info.name, info.team)
    awarded += _appearanceAwarded.size - before
  }
  return awarded
}

// TxOdds lineups give names as "Last, First" — our own roster stores
// "First Last". normalise() in scoring.ts already strips accents, so
// reordering here is the only transform needed for the two to line up.
function toDisplayName(txOddsName: string): string {
  const commaIdx = txOddsName.indexOf(',')
  if (commaIdx === -1) return txOddsName
  const last  = txOddsName.slice(0, commaIdx).trim()
  const first = txOddsName.slice(commaIdx + 1).trim()
  return `${first} ${last}`.trim()
}

// Replays a finished fixture's full historical event stream from TxOdds and
// computes every squad's appearance/goal/card/clean-sheet points for that
// one fixture, then writes the result straight to Postgres.
//
// Deliberately self-contained: squads are read fresh from the DB (not
// _squadCache), and starters/points are tracked in local variables scoped to
// this single call — nothing here touches _appearanceAwarded, state, or any
// other module-level cache. That makes it a pure function of (fixtureId,
// current DB squads) → points, so calling it again for the same fixture
// always recomputes the identical correct answer and *replaces* each
// affected player's entry in that day's daily_points row, rather than
// depending on in-memory state that a dev-server hot-reload can silently
// reset mid-session (which previously caused points to be lost or
// re-applied on top of themselves).
export async function backfillFixtureFromHistory(
  apiToken: string,
  fixtureId: string,
  date?: string,
): Promise<{ goals: number; cards: number; appearances: number; cleanSheets: number }> {
  const squads = await getAllSquads()
  const events = await fetchMatchEvents(apiToken, fixtureId)

  // playerId -> { name, team }, and the starter set — both scoped to just
  // this fixture's own lineups event, not the shared module-level map.
  const playerNames = new Map<number, { name: string; team: string }>()
  const starters = new Set<number>()
  const teams: string[] = []

  for (const e of events) {
    if (e.action !== 'lineups') continue
    const rawLineups = (e.raw as { Lineups?: unknown[] })?.Lineups ?? []
    for (const teamLineup of rawLineups as Array<{ preferredName?: string; lineups?: unknown[] }>) {
      const team = String(teamLineup.preferredName ?? '')
      if (team && !teams.includes(team)) teams.push(team)
      for (const pl of (teamLineup.lineups ?? []) as Array<{
        starter?: boolean
        player?: { normativeId?: number; preferredName?: string }
      }>) {
        const nId    = pl.player?.normativeId
        const rawName = pl.player?.preferredName
        if (nId == null || !rawName) continue
        playerNames.set(nId, { name: toDisplayName(rawName), team })
        if (pl.starter) starters.add(nId)
      }
    }
  }

  // wallet -> playerId -> points, built entirely from this call's own replay.
  const result = new Map<string, Map<string, number>>()
  const addPoints = (wallet: string, player: Player, event: EventType) => {
    const bucket = result.get(wallet) ?? new Map<string, number>()
    bucket.set(player.id, (bucket.get(player.id) ?? 0) + pointsForEvent(player, event))
    result.set(wallet, bucket)
  }
  const forMatchingPlayers = (name: string, team: string, playerId: number, fn: (wallet: string, player: Player) => void) => {
    for (const squad of squads) {
      for (const player of Object.values(squad.squad) as Player[]) {
        if (!player || !playerMatches(player, name, team, playerId)) continue
        fn(squad.walletAddress, player)
      }
    }
  }

  let appearances = 0
  for (const nId of starters) {
    const known = playerNames.get(nId)
    if (!known) continue
    forMatchingPlayers(known.name, known.team, nId, (wallet, player) => {
      addPoints(wallet, player, 'appearance')
      appearances++
      console.log(`[scoring] APPEARANCE: ${player.name} (id=${nId}) +${pointsForEvent(player, 'appearance')}pts`)
    })
  }

  const seen = new Set<string>()
  const teamGoals = new Map<string, number>(teams.map((t) => [t, 0]))
  let goals = 0
  let cards = 0
  for (const e of events) {
    if (e.playerId == null) continue
    const key = `${e.action}:${e.playerId}:${e.minute}`
    if (seen.has(key)) continue
    seen.add(key)

    const known = playerNames.get(e.playerId)
    if (!known) continue

    if (e.action === 'goal') {
      forMatchingPlayers(known.name, known.team, e.playerId, (wallet, player) => {
        addPoints(wallet, player, 'goal')
        console.log(`[scoring] GOAL: ${player.name} (id=${e.playerId}) +${pointsForEvent(player, 'goal')}pts`)
      })
      goals++
      if (teamGoals.has(known.team)) teamGoals.set(known.team, teamGoals.get(known.team)! + 1)
    } else if (e.action === 'yellow_card' || e.action === 'red_card') {
      forMatchingPlayers(known.name, known.team, e.playerId, (wallet, player) => {
        addPoints(wallet, player, e.action as EventType)
        console.log(`[scoring] ${e.action.toUpperCase()}: ${player.name} (id=${e.playerId}) +${pointsForEvent(player, e.action as EventType)}pts`)
      })
      cards++
    }
  }

  // Clean sheets: every GK/DEF who started for a team that conceded 0.
  let cleanSheets = 0
  const teamEntries = Array.from(teamGoals.entries())
  if (teamEntries.length === 2) {
    const [[teamA, goalsA], [teamB, goalsB]] = teamEntries
    const awardCleanSheet = (team: string, concededByOpponent: number) => {
      if (concededByOpponent !== 0) return
      for (const squad of squads) {
        for (const player of Object.values(squad.squad) as Player[]) {
          if (!player || (player.position !== 'GK' && player.position !== 'DEF')) continue
          if (player.country.toLowerCase().trim() !== team.toLowerCase().trim()) continue
          const started = Array.from(starters).some((nId) => {
            const known = playerNames.get(nId)
            return known != null && playerMatches(player, known.name, known.team, nId)
          })
          if (!started) continue
          addPoints(squad.walletAddress, player, 'clean_sheet')
          cleanSheets++
          console.log(`[scoring] CLEAN SHEET: ${player.name} (${team}) +${pointsForEvent(player, 'clean_sheet')}pts`)
        }
      }
    }
    awardCleanSheet(teamA, goalsB)
    awardCleanSheet(teamB, goalsA)
  }

  // Persist: merge this fixture's freshly computed per-player points into
  // whatever's already stored for that wallet/date (points from a different
  // fixture the same day are left untouched), replacing — never adding to —
  // this fixture's own players' prior values.
  //
  // Sequential, not Promise.all: this does two round trips per wallet
  // (read-then-write), and the Supabase pooler caps session-mode connections
  // at 15 — firing all of them at once for a squad list bigger than ~7
  // exhausts the pool and the whole backfill fails outright.
  const d = date ?? todayDate()
  for (const [wallet, bucket] of result) {
    const existing = await getDailyPoints(wallet, d)
    const merged = { ...(existing?.playerPoints ?? {}) }
    for (const [playerId, points] of bucket) merged[playerId] = points
    await upsertDailyPoints(wallet, d, merged)

    // This player's points for this fixture are now the authoritative DB
    // value picked up via _dbTotalsCache — drop the matching live-session
    // entry (if any) so buildLeaderboard() doesn't add it a second time
    // on top of the number we just persisted.
    for (const playerId of bucket.keys()) delete state[wallet]?.[playerId]
  }

  return { goals, cards, appearances, cleanSheets }
}

function handleScoringEvent(
  playerName: string,
  teamName:   string,
  event:      EventType,
  label:      string,
  playerId?:  number | null,
) {
  rolloverIfNewDay()

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
      awardAppearance(p.normativeId, p.name, p.team)
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
      if (finished) {
        // Snapshot immediately so whatever was tracked live during the match
        // isn't lost even if the authoritative recompute below never runs.
        snapshotPoints().catch((e) => console.error('[scoring] snapshot failed:', e))
        scheduleFullTimeRecompute(data.fixtureId)
      }
    }
  })

  console.log('[scoring] live scoring started')
}

// TxOdds's historical endpoint (what backfillFixtureFromHistory reads) isn't
// necessarily populated the instant full-time fires, so give it a couple of
// minutes before trusting it as the final answer. This recompute is what
// actually applies the clean-sheet bonus — full-time is the earliest point
// a "conceded zero" claim is even true — and it also corrects anything the
// live goal/card handlers missed (e.g. a player whose live event arrived
// before _squadCache had caught up with a squad saved mid-match).
function scheduleFullTimeRecompute(fixtureId: string, delayMs = 2 * 60_000) {
  setTimeout(() => {
    const apiToken = (global as Record<string, unknown>).__txoddsToken as string | undefined
    if (!apiToken) return
    backfillFixtureFromHistory(apiToken, fixtureId)
      .then((result) => {
        console.log(`[scoring] full-time recompute for fixture ${fixtureId}:`, result)
        return refreshDbTotalsCache()
      })
      .then(() => broadcast())
      .catch((e) => console.error(`[scoring] full-time recompute failed for fixture ${fixtureId}:`, e))
  }, delayMs)
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
// The in-memory session only reflects *today* — a request for any other date
// always goes straight to the DB snapshot for that day instead.
export async function getWalletDailyPoints(walletAddress: string, date?: string): Promise<Record<string, number>> {
  rolloverIfNewDay()
  const d = date ?? todayDate()
  if (d === todayDate()) {
    const inMem: Record<string, number> = {}
    for (const [pid, ls] of Object.entries(state[walletAddress] ?? {})) {
      if (ls.points !== 0) inMem[pid] = ls.points
    }
    if (Object.keys(inMem).length > 0) return inMem  // session is live — use live data
  }
  const saved = await getDailyPoints(walletAddress, d)
  return saved?.playerPoints ?? {}
}

// Returns total accumulated per-player points for a wallet across all days.
export async function getWalletAccumulatedPoints(walletAddress: string): Promise<Record<string, number>> {
  rolloverIfNewDay()
  const { playerPoints } = await getWalletTotalPoints(walletAddress)
  // Merge with current in-memory session (avoids waiting for next snapshot)
  for (const [pid, ls] of Object.entries(state[walletAddress] ?? {})) {
    if (ls.points !== 0) playerPoints[pid] = (playerPoints[pid] ?? 0) + ls.points
  }
  return playerPoints
}

// Returns per-player points for a wallet earned within [startDate, endDate]
// (inclusive, YYYY-MM-DD) — used to scope a squad's breakdown to a specific
// tournament's window instead of the wallet's whole career total.
export async function getWalletPointsInRange(
  walletAddress: string,
  startDate: string,
  endDate: string,
): Promise<Record<string, number>> {
  rolloverIfNewDay()
  const { playerPoints } = await getWalletPointsInRangeFromDb(walletAddress, startDate, endDate)
  // Merge in today's live session, but only if today actually falls inside
  // the requested range — otherwise a tournament that already ended would
  // pick up points from a match that happened after it closed.
  const today = todayDate()
  if (today >= startDate && today <= endDate) {
    for (const [pid, ls] of Object.entries(state[walletAddress] ?? {})) {
      if (ls.points !== 0) playerPoints[pid] = (playerPoints[pid] ?? 0) + ls.points
    }
  }
  return playerPoints
}

// Returns total points per wallet across all days (for leaderboard ranking).
export async function getTotalLeaderboard(): Promise<Array<{ walletAddress: string; total: number }>> {
  rolloverIfNewDay()
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
  rolloverIfNewDay()
  const rows: SquadLiveScore[] = _squadCache.map(squad => {
    const playerEntries = Object.values(state[squad.walletAddress] ?? {})
    const sessionPoints = playerEntries.reduce((s, p) => s + p.points, 0)
    // Rank on the full season total (prior days from the DB cache + today's
    // live session), not just whatever's happened in memory since the last
    // rollover — otherwise the leaderboard would reset to 0 every midnight.
    const totalPoints = (_dbTotalsCache.get(squad.walletAddress) ?? 0) + sessionPoints
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
