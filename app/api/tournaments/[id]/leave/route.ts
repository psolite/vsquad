import { NextRequest, NextResponse } from 'next/server'
import { leaveTournament } from '@/lib/db'

type Params = { params: Promise<{ id: string }> }

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params
  const { walletAddress } = await req.json() as { walletAddress?: string }
  if (!walletAddress) return NextResponse.json({ error: 'walletAddress is required' }, { status: 400 })

  const ok = await leaveTournament(id, walletAddress)
  if (!ok) return NextResponse.json({ error: 'Not a participant or tournament not found' }, { status: 404 })
  return NextResponse.json({ message: 'Left tournament', tournamentId: id })
}
