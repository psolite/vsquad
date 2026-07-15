import { NextResponse } from 'next/server'
import { buildLeaderboard, refreshSquadCache, refreshDbTotalsCache } from '@/lib/services/liveScoring'

export const dynamic = 'force-dynamic'

export async function GET() {
  // The in-memory squad + DB-totals caches backing buildLeaderboard() are only
  // kept in sync by fire-and-forget refreshes after squad/points writes — in
  // dev, a Turbopack module reload can silently wipe them back to empty.
  // Refresh both from Postgres on every request so this route can't serve a
  // stale/empty leaderboard (squads present but everyone showing 0 points).
  await Promise.all([refreshSquadCache(), refreshDbTotalsCache()])
  return NextResponse.json(buildLeaderboard())
}
