import { NextRequest, NextResponse } from 'next/server'
import { getWalletDailyPoints, getWalletAccumulatedPoints, snapshotPoints } from '@/lib/services/liveScoring'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const wallet = searchParams.get('wallet')
  const mode   = searchParams.get('mode') ?? 'today'   // 'today' | 'total'
  const date   = searchParams.get('date') ?? undefined  // YYYY-MM-DD, defaults to today

  if (!wallet) {
    return NextResponse.json({ error: 'wallet query param required' }, { status: 400 })
  }

  try {
    const points = mode === 'total'
      ? await getWalletAccumulatedPoints(wallet)
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
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
