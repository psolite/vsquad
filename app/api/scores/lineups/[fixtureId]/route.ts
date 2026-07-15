import { NextResponse } from 'next/server'
import { fetchFixtures, fetchLineups } from '@/lib/services/txodds/index'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ fixtureId: string }> },
) {
  const apiToken = (global as Record<string, unknown>).__txoddsToken as string | undefined
  if (!apiToken) {
    return NextResponse.json({ error: 'TxOdds not initialised' }, { status: 503 })
  }

  const { fixtureId } = await params

  try {
    // Need participant1IsHome from the fixture snapshot to correctly assign home/away
    const fixtures = await fetchFixtures(apiToken, { fromDaysAgo: 30 })
    const fixture  = fixtures.find((f) => f.fixtureId === fixtureId)
    const p1IsHome = fixture?.participant1IsHome ?? true

    const lineups = await fetchLineups(apiToken, fixtureId, p1IsHome)
    if (!lineups) {
      return NextResponse.json({ error: 'No lineup data available' }, { status: 404 })
    }
    return NextResponse.json(lineups)
  } catch (err: unknown) {
    console.error('[lineups] error:', (err as Error).message)
    return NextResponse.json({ error: 'Failed to fetch lineups' }, { status: 502 })
  }
}
