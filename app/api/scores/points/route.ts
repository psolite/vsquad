import { NextRequest, NextResponse } from 'next/server'
import { getWalletDailyPoints, getWalletAccumulatedPoints, getWalletPointsInRange, snapshotPoints, refreshDbTotalsCache } from '@/lib/services/liveScoring'
import { deleteDailyPointsForDate, deleteAllDailyPoints } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const wallet = searchParams.get('wallet')
  const mode   = searchParams.get('mode') ?? 'today'   // 'today' | 'total' | 'range'
  const date   = searchParams.get('date') ?? undefined  // YYYY-MM-DD, defaults to today
  const start  = searchParams.get('start') ?? undefined  // YYYY-MM-DD, mode=range only
  const end    = searchParams.get('end') ?? undefined    // YYYY-MM-DD, mode=range only

  if (!wallet) {
    return NextResponse.json({ error: 'wallet query param required' }, { status: 400 })
  }
  if (mode === 'range' && (!start || !end)) {
    return NextResponse.json({ error: 'start and end query params required for mode=range' }, { status: 400 })
  }

  try {
    const points = mode === 'total' ? await getWalletAccumulatedPoints(wallet)
      : mode === 'range' ? await getWalletPointsInRange(wallet, start!, end!)
      : await getWalletDailyPoints(wallet, date)

    return NextResponse.json(points)
  } catch (err: unknown) {
    console.error('[points] GET failed:', (err as Error).message)
    return NextResponse.json({}, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const date = searchParams.get('date') ?? undefined
  try {
    await snapshotPoints(date)
    await refreshDbTotalsCache()
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

// Removes daily_points rows — either a single day (?date=YYYY-MM-DD) or
// everything (?all=true). Used to undo snapshots that landed under the
// wrong date(s).
export async function DELETE(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date')
  const all  = request.nextUrl.searchParams.get('all') === 'true'
  if (!date && !all) return NextResponse.json({ error: 'date or all=true query param required' }, { status: 400 })
  try {
    const deleted = all ? await deleteAllDailyPoints() : await deleteDailyPointsForDate(date!)
    await refreshDbTotalsCache()
    return NextResponse.json({ ok: true, deleted })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
