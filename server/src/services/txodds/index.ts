import axios from 'axios'
import { EventEmitter } from 'events'
import { cfg } from './config'

export { authenticate } from './activate'
export { cfg }

// ── Types ─────────────────────────────────────────────────────────────────────

export interface GoalEvent {
  fixtureId:  string
  teamName:   string
  playerName: string
  playerId:   number | null
  minute:     number
  score:      string
  type:       string
  raw:        unknown
}

export interface CardEvent {
  fixtureId:  string
  teamName:   string
  playerId:   number | null
  cardType:   'yellow_card' | 'red_card'
  minute:     number
  raw:        unknown
}

export interface FixtureEvent {
  fixtureId:        string
  homeTeam:         string
  awayTeam:         string
  competition:      string
  round:            string         // e.g. "Group A", "Round of 16"
  startTime:        number         // unix ms timestamp
  participant1IsHome: boolean      // needed to correctly map scores
  homeScore:        number | null
  awayScore:        number | null
  statusId:         number         // 0=upcoming 1=live 2+=finished
  status:           'upcoming' | 'live' | 'finished'
  statusCode:       string | null  // 'H1','HT','H2','F','FET','FPE', etc.
  minute:           number | null
  raw:              unknown
}

// ── JWT cache ─────────────────────────────────────────────────────────────────

let _jwt: string | null = null

export async function getSessionJwt(): Promise<string> {
  if (_jwt) return _jwt
  const { origin } = cfg()
  const { data } = await axios.post<{ token: string }>(`${origin}/auth/guest/start`)
  _jwt = data.token
  setTimeout(() => { _jwt = null }, 10 * 60 * 1000)
  return _jwt
}

function authHeaders(apiToken: string, jwt: string, sse = false): Record<string, string> {
  return {
    'Authorization': `Bearer ${jwt}`,
    'X-Api-Token':   apiToken,
    'Cache-Control': 'no-cache',
    ...(sse && { 'Accept': 'text/event-stream' }),
  }
}

// ── SSE parser (fetch-based, as recommended by TxOdds docs) ──────────────────

async function* readSseMessages(body: AsyncIterable<Uint8Array>) {
  const decoder = new TextDecoder()
  let buffer = ''

  for await (const chunk of body) {
    buffer += decoder.decode(chunk, { stream: true })
    const blocks = buffer.split(/\r?\n\r?\n/)
    buffer = blocks.pop() ?? ''

    for (const block of blocks) {
      const msg: Record<string, string> = {}
      for (const line of block.split(/\r?\n/)) {
        const colon = line.indexOf(':')
        if (colon === -1) continue
        const field = line.slice(0, colon).trim()
        const value = line.slice(colon + 1).trim()
        if (field) msg[field] = value
      }
      if (msg.data) yield msg
    }
  }
}

// ── Score stream ──────────────────────────────────────────────────────────────

export const scoreEmitter = new EventEmitter()

let _streaming = false

export async function startScoreStream(apiToken: string) {
  if (_streaming) return
  _streaming = true

  const { apiBase } = cfg()
  const url = `${apiBase}/scores/stream`

  const loop = async () => {
    while (_streaming) {
      try {
        const jwt = await getSessionJwt()
        const res = await fetch(url, { headers: authHeaders(apiToken, jwt, true) })

        if (!res.ok || !res.body) {
          console.error(`[txodds] stream HTTP ${res.status} — retrying in 5s`)
          _jwt = null
          await new Promise(r => setTimeout(r, 5_000))
          continue
        }

        console.log('[txodds] score stream connected')

        for await (const msg of readSseMessages(res.body as any)) {
          try {
            const parsed   = JSON.parse(msg.data)
            // TXOdds stream format: { FixtureInfo: {...}, Update: { Action, Data, Participant, Score, Clock, ... } }
            const info     = parsed.FixtureInfo ?? {}
            const update   = parsed.Update ?? parsed
            const action   = String(update.Action ?? '').toLowerCase()
            const fixtureId = String(update.FixtureId ?? info.FixtureId ?? '')
            const playerId: number | null = update.Data?.PlayerId ?? null

            // Score: { Participant1: N, Participant2: N }
            const sc    = update.Score ?? {}
            const score = sc.Participant1 != null ? `${sc.Participant1}-${sc.Participant2}` : ''

            // Minute from elapsed clock seconds
            const clockSecs = update.Clock?.Seconds ?? null
            const minute    = clockSecs != null ? Math.floor(clockSecs / 60) : 0

            // Team name: Participant 1 or 2 → FixtureInfo name
            const participantNum = update.Participant ?? null
            const teamName = participantNum === 1
              ? (info.Participant1 ?? '')
              : participantNum === 2 ? (info.Participant2 ?? '') : ''

            if (action === 'goal') {
              const event: GoalEvent = {
                fixtureId, teamName, playerName: '', playerId,
                minute, score, type: 'goal', raw: parsed,
              }
              scoreEmitter.emit('goal', event)
            } else if (action === 'yellow_card' || action === 'red_card') {
              const event: CardEvent = {
                fixtureId, teamName, playerId,
                cardType: action as 'yellow_card' | 'red_card',
                minute, raw: parsed,
              }
              scoreEmitter.emit('card', event)
            } else {
              scoreEmitter.emit('update', { action, fixtureId, score, minute, raw: parsed })
            }
          } catch { /* ignore malformed */ }
        }

        console.log('[txodds] stream ended — reconnecting in 2s')
        await new Promise(r => setTimeout(r, 2_000))
      } catch (err: any) {
        console.error('[txodds] stream error:', err.message, '— retrying in 5s')
        _jwt = null
        await new Promise(r => setTimeout(r, 5_000))
      }
    }
  }

  loop() // fire-and-forget, self-reconnecting
}

export function stopScoreStream() {
  _streaming = false
}

// ── Per-fixture score snapshot ─────────────────────────────────────────────────
// GET /api/scores/snapshot/{fixtureId}  →  array of score event snapshots.
// We take the last entry's scoreSoccer to get the current/final score.

interface CachedScore { homeScore: number; awayScore: number; minute: number | null; fetchedAt: number }
const _scoreCache = new Map<string, CachedScore>()
const SCORE_CACHE_TTL = 2 * 60_000  // re-fetch live scores every 2 min, finished scores are stable

// StatusId numeric mapping (confirmed from probe):
//   0-1 = not started / scheduled
//   2-3 = in progress (live)
//   4+  = finished (full time / AET / pens / cancelled)
function resolveMatchStatus(code: string): 'live' | 'finished' | 'upcoming' {
  const n = Number(code)
  if (!isNaN(n)) {
    if (n >= 4) return 'finished'
    if (n >= 2) return 'live'
    return 'upcoming'    // 0 or 1 = not started
  }
  // String fallbacks
  const finished = new Set(['F','FET','FPE','C','A','TXCC','TXCS','Finished','finished'])
  const live     = new Set(['H1','HT','H2','ET1','ET2','HTET','WET','PE','WPE','InProgress'])
  if (finished.has(code)) return 'finished'
  if (live.has(code))     return 'live'
  return 'upcoming'
}

export interface MatchScoreResult {
  homeScore:   number
  awayScore:   number
  minute:      number | null
  statusCode:  string            // e.g. 'H1', 'HT', 'F'
  matchStatus: 'live' | 'finished' | 'upcoming'
  homeYellow:  number
  awayYellow:  number
  homeRed:     number
  awayRed:     number
}

export async function fetchMatchScore(
  apiToken: string,
  fixtureId: string,
  isLive = false,
  participant1IsHome = true,   // from fixture snapshot — don't trust score snapshot's copy
): Promise<MatchScoreResult | null> {
  const cached = _scoreCache.get(fixtureId)
  const ttl    = isLive ? SCORE_CACHE_TTL : 30 * 60_000
  if (cached && Date.now() - cached.fetchedAt < ttl) return cached as unknown as MatchScoreResult

  const { apiBase } = cfg()
  try {
    const jwt = await getSessionJwt()
    const { data } = await axios.get(`${apiBase}/scores/snapshot/${fixtureId}`, {
      headers: authHeaders(apiToken, jwt),
    })
    const snapshots: any[] = Array.isArray(data) ? data : []
    if (snapshots.length === 0) return null

    const last       = snapshots[snapshots.length - 1]
    const scoreObj   = last.Score ?? last.scoreSoccer ?? null   // actual field is 'Score'
    const statusCode = String(last.StatusId ?? last.statusSoccerId ?? last.GameState ?? 'NS')

    // Minute from Data or Clock
    const dataObj = last.Data ?? last.dataSoccer ?? {}
    const clock   = last.Clock ?? {}
    const minute: number | null =
      dataObj.Minute ?? dataObj.minute ??
      clock.Minutes  ?? clock.minutes  ?? null

    if (!scoreObj) {
      // Log once to help diagnose if Score is still undefined
      console.log('[txodds] no Score field in snapshot, StatusId:', last.StatusId, 'GameState:', last.GameState)
      return null
    }

    // Use the value from the fixture snapshot — score snapshot's copy may differ
    const p1IsHome  = participant1IsHome
    const scoreP1   = scoreObj.Participant1 ?? scoreObj.participant1 ?? {}
    const scoreP2   = scoreObj.Participant2 ?? scoreObj.participant2 ?? {}
    const totHome   = (p1IsHome ? scoreP1 : scoreP2).Total ?? (p1IsHome ? scoreP1 : scoreP2)
    const totAway   = (p1IsHome ? scoreP2 : scoreP1).Total ?? (p1IsHome ? scoreP2 : scoreP1)

    // If the match started more than 110 min ago it is finished regardless of what
    // StatusId says — the snapshot StatusId reflects the phase of the LAST ACTION
    // (e.g. a goal in H2 leaves StatusId=H2/4), not the current match state.
    const startTimeMs   = last.StartTime ?? 0
    const elapsed       = Date.now() - startTimeMs
    const matchStatus   = elapsed > 110 * 60_000 ? 'finished' : resolveMatchStatus(statusCode)
    const finalStatus   = matchStatus === 'finished' ? 'F' : statusCode

    const homeScore  = Number(totHome.Goals       ?? totHome.goals       ?? 0)
    const awayScore  = Number(totAway.Goals       ?? totAway.goals       ?? 0)
    const homeYellow = Number(totHome.YellowCards ?? totHome.yellowCards ?? 0)
    const awayYellow = Number(totAway.YellowCards ?? totAway.yellowCards ?? 0)
    const homeRed    = Number(totHome.RedCards    ?? totHome.redCards    ?? 0)
    const awayRed    = Number(totAway.RedCards    ?? totAway.redCards    ?? 0)

    console.log(`[txodds] score parsed: ${homeScore}-${awayScore} status=${matchStatus} statusCode=${finalStatus}`)

    const result = { homeScore, awayScore, minute, statusCode: finalStatus, matchStatus, homeYellow, awayYellow, homeRed, awayRed, fetchedAt: Date.now() }
    _scoreCache.set(fixtureId, result as any)
    return result
  } catch (err: any) {
    console.error(`[txodds] score snapshot ${fixtureId}:`, err.message)
    return null
  }
}

// ── Probe ─────────────────────────────────────────────────────────────────────

export async function probeToken(apiToken: string): Promise<void> {
  const { apiBase } = cfg()
  try {
    const jwt = await getSessionJwt()

    // 1 — fixtures snapshot
    const todayEpochDay  = Math.floor(Date.now() / 86_400_000)
    const startEpochDay  = todayEpochDay - 30
    const { status: fStatus, data: fData } = await axios.get(`${apiBase}/fixtures/snapshot`, {
      headers: authHeaders(apiToken, jwt),
      params:  { startEpochDay },
      validateStatus: () => true,
    })
    const list: any[] = Array.isArray(fData) ? fData : (fData.fixtures ?? fData.data ?? [])
    console.log(`[txodds] fixtures/snapshot → ${fStatus}, ${list.length} total fixtures`)

    if (list.length > 0) {
      console.log('[txodds] fixture fields:', Object.keys(list[0]).join(', '))

      // Show one of each competition in the list
      const byComp: Record<string, any> = {}
      for (const f of list) {
        const c = f.Competition ?? 'Unknown'
        if (!byComp[c]) byComp[c] = f
      }
      for (const [comp, f] of Object.entries(byComp)) {
        console.log(`[txodds] ${comp} sample: FixtureId=${f.FixtureId} ${f.Participant1} vs ${f.Participant2} start=${new Date(f.StartTime).toISOString()}`)
      }

      // 2 — probe scores/snapshot for the first non-friendly fixture
      const nonFriendly = list.find((f) => {
        const c = (f.Competition ?? '').toLowerCase()
        return !c.includes('friendly') && !c.includes('friendlies')
      }) ?? list[0]

      if (nonFriendly) {
        console.log(`[txodds] probing scores/snapshot for fixture ${nonFriendly.FixtureId} (${nonFriendly.Participant1} vs ${nonFriendly.Participant2})`)
        const { status: sStatus, data: sData } = await axios.get(`${apiBase}/scores/snapshot/${nonFriendly.FixtureId}`, {
          headers:        authHeaders(apiToken, jwt),
          validateStatus: () => true,
        })
        console.log(`[txodds] scores/snapshot → ${sStatus}`)
        if (Array.isArray(sData) && sData.length > 0) {
          const last = sData[sData.length - 1]
          console.log('[txodds] score snapshot fields:', Object.keys(last).join(', '))
          console.log('[txodds] StatusId:', last.StatusId)
          console.log('[txodds] GameState:', last.GameState)
          console.log('[txodds] Score:', JSON.stringify(last.Score, null, 2))
          console.log('[txodds] Data:', JSON.stringify(last.Data, null, 2))
        } else {
          console.log('[txodds] scores/snapshot raw response:', JSON.stringify(sData).slice(0, 500))
        }
      }
    }
  } catch (err: any) {
    console.error('[txodds] probe failed:', err.message)
  }
}

// ── Fixtures snapshot ─────────────────────────────────────────────────────────

// TxOdds fixture snapshot has no StatusId/Score fields — derive from time.
// A match is "live" for up to 110 minutes after kick-off, then "finished".
function deriveStatus(startTimeMs: number): 'upcoming' | 'live' | 'finished' {
  const now     = Date.now()
  const elapsed = now - startTimeMs          // ms since kick-off
  if (startTimeMs > now + 5 * 60_000) return 'upcoming'
  if (elapsed < 110 * 60_000)         return 'live'
  return 'finished'
}

export async function fetchFixtures(
  apiToken: string,
  opts: { fromDaysAgo?: number; competitionId?: number } = {}
): Promise<FixtureEvent[]> {
  const { apiBase } = cfg()
  const jwt = await getSessionJwt()

  // epoch day = floor(unix_seconds / 86400)
  const todayEpochDay = Math.floor(Date.now() / 86_400_000)
  const startEpochDay = todayEpochDay - (opts.fromDaysAgo ?? 30)

  const { data } = await axios.get(`${apiBase}/fixtures/snapshot`, {
    headers: authHeaders(apiToken, jwt),
    params: {
      startEpochDay,
      ...(opts.competitionId != null && { competitionId: opts.competitionId }),
    },
  })

  const rawList: unknown[] = Array.isArray(data) ? data : (data.fixtures ?? data.data ?? [])
  const list = rawList.filter((f: any) => {
    const comp = (f.Competition ?? f.competition ?? '').toLowerCase()
    return !comp.includes('friendly') && !comp.includes('friendlies')
  })
  return list.map((f: any) => {
    const startTime: number = f.StartTime ?? f.startTime ?? 0
    const status = deriveStatus(startTime)
    // Participant1IsHome tells us which participant is actually the home side
    const p1IsHome = f.Participant1IsHome !== false   // default true if absent
    const homeTeam = p1IsHome ? (f.Participant1 ?? '') : (f.Participant2 ?? '')
    const awayTeam = p1IsHome ? (f.Participant2 ?? '') : (f.Participant1 ?? '')
    return {
      fixtureId:   String(f.FixtureId   ?? f.fixtureId   ?? ''),
      homeTeam,
      awayTeam,
      competition: f.Competition  ?? f.competition ?? '',
      round:       f.Round ?? f.RoundName ?? f.GroupName ?? f.round ?? f.roundName ?? '',
      startTime,
      // Scores come exclusively from the live stream overlay — not in the snapshot
      participant1IsHome: p1IsHome,
      homeScore:   null,
      awayScore:   null,
      statusId:    status === 'live' ? 1 : status === 'finished' ? 2 : 0,
      status,
      statusCode:  null,
      minute:      null,
      raw:         f,
    }
  })
}
