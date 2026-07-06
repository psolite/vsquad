import { NextRequest, NextResponse } from 'next/server'
import { getSquad, joinTournament } from '@/lib/db'

type Params = { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params
  const { walletAddress } = await req.json() as { walletAddress?: string }
  if (!walletAddress) return NextResponse.json({ error: 'walletAddress is required' }, { status: 400 })

  const squad = await getSquad(walletAddress)
  if (!squad) return NextResponse.json({ error: 'You must save a squad before joining a tournament' }, { status: 403 })

  const t = await joinTournament(id, walletAddress)
  if (!t) return NextResponse.json({ error: 'Tournament not found or is full' }, { status: 400 })
  return NextResponse.json(t)
}
