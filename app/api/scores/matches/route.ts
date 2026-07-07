import { NextResponse } from 'next/server'
import { fetchFixtures, fetchMatchScore } from '@/lib/services/txodds/index'
import type { FixtureEvent } from '@/lib/services/txodds/index'
import { getMatchScores } from '@/lib/services/liveScoring'
import type { MatchLiveScore } from '@/lib/services/liveScoring'

export const dynamic = 'force-dynamic'

export async function GET() {
  const apiToken = (global as Record<string, unknown>).__txoddsToken as string | undefined
  if (!apiToken) {
    return NextResponse.json({ error: 'TxOdds not initialised' }, { status: 503 })
  }

  try {
    const KNOCKOUT_START = new Date('2026-06-28T00:00:00Z').getTime()
    const allFixtures = await fetchFixtures(apiToken, { fromDaysAgo: 30 })
    const fixtures = allFixtures.filter((f) => f.startTime >= KNOCKOUT_START)

    const liveMap = new Map<string, MatchLiveScore>(
      getMatchScores().map((m) => [m.fixtureId, m])
    )

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
          homeScore:  s.homeScore,
          awayScore:  s.awayScore,
          minute:     s.minute,
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
    const finished = matches
      .filter((m) => m.status === 'finished' && m.homeScore != null && m.awayScore != null)
      .sort((a, b) => b.startTime - a.startTime)

    return NextResponse.json({ live, today, finished, upcoming })
  } catch (err: unknown) {
    console.error('[scores] matches fetch error:', (err as Error).message)
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 502 })
  }
}
