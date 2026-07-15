import { NextRequest, NextResponse } from 'next/server'
import { backfillFixtureFromHistory, refreshDbTotalsCache } from '@/lib/services/liveScoring'

export const dynamic = 'force-dynamic'

// Replays a finished fixture's real historical events from TxOdds (goals,
// cards, lineups/starters) and attributes fantasy points to whichever squad
// players actually took part — not just a flat per-country appearance bonus.
// Body: { fixtureId: string, date?: string }. `date` (YYYY-MM-DD) controls
// which daily_points row this gets persisted under; defaults to today.
//
// backfillFixtureFromHistory reads squads straight from Postgres and writes
// its result straight back — it doesn't touch any in-memory cache, so this
// route is safe to call for the same fixtureId any number of times and will
// always land on the same correct, fully-replaced answer.
export async function POST(request: NextRequest) {
  const apiToken = (global as Record<string, unknown>).__txoddsToken as string | undefined
  if (!apiToken) return NextResponse.json({ error: 'TxOdds not initialised' }, { status: 503 })

  try {
    const body = await request.json().catch(() => null) as { fixtureId?: string; date?: string } | null
    if (!body?.fixtureId) return NextResponse.json({ error: 'fixtureId required' }, { status: 400 })

    const result = await backfillFixtureFromHistory(apiToken, body.fixtureId, body.date)
    await refreshDbTotalsCache()
    return NextResponse.json({ ok: true, ...result })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
