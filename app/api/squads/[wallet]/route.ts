import { NextRequest, NextResponse } from 'next/server'
import { getSquad, deleteSquad } from '@/lib/db'
import { refreshSquadCache } from '@/lib/services/liveScoring'

type Params = { params: Promise<{ wallet: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { wallet } = await params
  try {
    const record = await getSquad(wallet)
    if (!record) return NextResponse.json({ error: 'Squad not found' }, { status: 404 })
    return NextResponse.json(record)
  } catch (err: unknown) {
    console.error('[squads] failed to fetch squad for wallet', wallet, err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to fetch squad' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { wallet } = await params
  const ok = await deleteSquad(wallet)
  if (!ok) return NextResponse.json({ error: 'Squad not found' }, { status: 404 })
  refreshSquadCache().catch(() => {})
  return NextResponse.json({ message: 'Squad deleted' })
}
