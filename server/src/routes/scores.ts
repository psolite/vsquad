import { Router, Request, Response } from 'express'
import { scoreEmitter, fetchFixtures, fetchMatchScore, GoalEvent, FixtureEvent } from '../services/txodds/index'
import {
  liveScoringEmitter, buildLeaderboard, POINTS,
  getMatchScores, MatchLiveScore, getDiscoveredPlayers,
} from '../services/liveScoring'

const router = Router()

// ── GET /api/scores/live  (SSE) ───────────────────────────────────────────────
router.get('/live', (req: Request, res: Response) => {
  res.setHeader('Content-Type',      'text/event-stream')
  res.setHeader('Cache-Control',     'no-cache')
  res.setHeader('Connection',        'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')
  res.flushHeaders()

  res.write(`event: leaderboard\ndata: ${JSON.stringify(buildLeaderboard())}\n\n`)

  const onGoal = (event: GoalEvent) => {
    res.write(`event: goal\ndata: ${JSON.stringify(event)}\n\n`)
  }
  const onUpdate = (data: unknown) => {
    res.write(`event: score-update\ndata: ${JSON.stringify(data)}\n\n`)
  }
  const onLeaderboard = (data: unknown) => {
    res.write(`event: leaderboard\ndata: ${JSON.stringify(data)}\n\n`)
  }

  scoreEmitter.on('goal',              onGoal)
  scoreEmitter.on('update',            onUpdate)
  liveScoringEmitter.on('leaderboard', onLeaderboard)

  const heartbeat = setInterval(() => res.write(': heartbeat\n\n'), 30_000)

  req.on('close', () => {
    scoreEmitter.off('goal',              onGoal)
    scoreEmitter.off('update',            onUpdate)
    liveScoringEmitter.off('leaderboard', onLeaderboard)
    clearInterval(heartbeat)
  })
})

// ── GET /api/scores/leaderboard ───────────────────────────────────────────────
router.get('/leaderboard', (_req: Request, res: Response) => {
  res.json(buildLeaderboard())
})

// ── GET /api/scores/points ────────────────────────────────────────────────────
router.get('/points', (_req: Request, res: Response) => {
  res.json(POINTS)
})

// ── GET /api/scores/matches ───────────────────────────────────────────────────
// Returns past (30 days) + live + upcoming fixtures, with in-memory live
// score overlay applied on top of whatever the snapshot returns.
router.get('/matches', async (_req: Request, res: Response) => {
  const apiToken = (global as any).__txoddsToken as string | undefined
  if (!apiToken) {
    res.status(503).json({ error: 'TxOdds not initialised' })
    return
  }
  try {
    const KNOCKOUT_START = new Date('2026-06-28T00:00:00Z').getTime()
    const allFixtures = await fetchFixtures(apiToken, { fromDaysAgo: 30 })
    const fixtures = allFixtures.filter((f) => f.startTime >= KNOCKOUT_START)

    // Apply in-memory live scores on top of snapshot data
    const liveMap = new Map<string, MatchLiveScore>(
      getMatchScores().map((m) => [m.fixtureId, m])
    )

    // Apply in-memory stream scores first (highest priority)
    let matches: FixtureEvent[] = fixtures.map((f) => {
      const stream = liveMap.get(f.fixtureId)
      if (!stream) return f
      return {
        ...f,
        homeScore: stream.homeScore,
        awayScore: stream.awayScore,
        minute:    stream.minute,
        status:    stream.matchStatus,
        statusId:  stream.matchStatus === 'live' ? 1 : 2,
      }
    })

    // For matches still without a score, fetch from /scores/snapshot/{fixtureId}
    // Limit to live + recently finished (last 7 days) to avoid too many requests
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60_000
    const needsScore = matches.filter(
      (m) => m.homeScore == null && (m.status === 'live' || (m.status === 'finished' && m.startTime > sevenDaysAgo))
    )

    if (needsScore.length > 0) {
      const scored = await Promise.allSettled(
        needsScore.map((m) => fetchMatchScore(apiToken, m.fixtureId, m.status === 'live', m.participant1IsHome))
      )
      matches = matches.map((m) => {
        const idx = needsScore.findIndex((n) => n.fixtureId === m.fixtureId)
        if (idx === -1) return m
        const result = scored[idx]
        if (result.status !== 'fulfilled' || !result.value) return m
        const s = result.value
        return {
          ...m,
          homeScore: s.homeScore,
          awayScore: s.awayScore,
          minute:    s.minute,
          // Use the authoritative status from the score snapshot
          status:     s.matchStatus,
          statusId:   s.matchStatus === 'live' ? 1 : s.matchStatus === 'finished' ? 2 : 0,
          statusCode: s.statusCode,
        }
      })
    }

    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
    const todayEnd   = new Date(); todayEnd.setHours(23, 59, 59, 999)
    const isToday    = (m: FixtureEvent) => m.startTime >= todayStart.getTime() && m.startTime <= todayEnd.getTime()

    const live     = matches.filter((m) => m.status === 'live')
    const today    = matches.filter((m) => m.status === 'upcoming' && isToday(m)).sort((a, b) => a.startTime - b.startTime)
    const upcoming = matches.filter((m) => m.status === 'upcoming' && !isToday(m)).sort((a, b) => a.startTime - b.startTime)
    const finished = matches.filter((m) => m.status === 'finished').sort((a, b) => b.startTime - a.startTime)

    res.json({ live, today, finished, upcoming })
  } catch (err: any) {
    console.error('[scores] matches fetch error:', err.message)
    res.status(502).json({ error: 'Failed to fetch matches' })
  }
})

// ── GET /api/scores/discovered-players  (admin) ───────────────────────────────
// Returns player IDs discovered from live stream events — use to populate txoddsId
router.get('/discovered-players', (_req: Request, res: Response) => {
  res.json(getDiscoveredPlayers())
})

// ── GET /api/scores/fixtures (legacy) ────────────────────────────────────────
router.get('/fixtures', async (_req: Request, res: Response) => {
  const apiToken = (global as any).__txoddsToken as string | undefined
  if (!apiToken) {
    res.status(503).json({ error: 'TxOdds not initialised' })
    return
  }
  try {
    const fixtures = await fetchFixtures(apiToken)
    res.json({ fixtures })
  } catch (err: any) {
    console.error('[scores] fixtures fetch error:', err.message)
    res.status(502).json({ error: 'Failed to fetch fixtures' })
  }
})

export default router
