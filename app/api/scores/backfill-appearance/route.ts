import { NextRequest, NextResponse } from 'next/server'
import { backfillAppearancePoints, awardAppearanceForMatch, refreshSquadCache, snapshotPoints } from '@/lib/services/liveScoring'

export const dynamic = 'force-dynamic'

interface MatchesResponse {
  live: Array<{ homeTeam: string; awayTeam: string }>
  today: Array<{ homeTeam: string; awayTeam: string }>
  finished: Array<{ homeTeam: string; awayTeam: string }>
}

// One-off maintenance action: re-applies the 2pt appearance bonus.
// - Body { homeTeam, awayTeam }: just that one match.
// - Body { all: true }: every match that's live, today, or finished (i.e.
//   has actually kicked off) — pulled from /api/scores/matches.
// - No body: re-applies it against every lineup already seen today.
// Safe to call repeatedly — already-awarded players are skipped either way.
export async function POST(request: NextRequest) {
  try {
    // This is a catch-up action, so it should never run against a stale
    // squad list — refresh straight from the DB first.
    await refreshSquadCache()

    const body = await request.json().catch(() => null) as
      | { homeTeam?: string; awayTeam?: string; all?: boolean; date?: string }
      | null
    const date = body?.date // YYYY-MM-DD override — defaults to today if omitted

    if (body?.homeTeam && body?.awayTeam) {
      const awarded = awardAppearanceForMatch(body.homeTeam, body.awayTeam)
      if (awarded > 0) await snapshotPoints(date)
      return NextResponse.json({ ok: true, awarded })
    }

    if (body?.all) {
      const res = await fetch(`${request.nextUrl.origin}/api/scores/matches`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`matches fetch failed: ${res.status}`)
      const data = (await res.json()) as MatchesResponse
      const played = [...data.live, ...data.today, ...data.finished]

      const seen = new Set<string>()
      let awarded = 0
      for (const f of played) {
        const key = `${f.homeTeam}|${f.awayTeam}`
        if (seen.has(key)) continue
        seen.add(key)
        awarded += awardAppearanceForMatch(f.homeTeam, f.awayTeam)
      }
      if (awarded > 0) await snapshotPoints(date)
      return NextResponse.json({ ok: true, awarded, matches: seen.size })
    }

    const awarded = backfillAppearancePoints()
    if (awarded > 0) await snapshotPoints(date)
    return NextResponse.json({ ok: true, awarded })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
