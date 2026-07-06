import { NextRequest, NextResponse } from 'next/server'
import { lockSquad } from '@/lib/db'

type Params = { params: Promise<{ wallet: string }> }

export async function PATCH(_req: NextRequest, { params }: Params) {
  const { wallet } = await params
  const ok = await lockSquad(wallet)
  if (!ok) return NextResponse.json({ error: 'Squad not found or already locked' }, { status: 404 })
  return NextResponse.json({ message: 'Squad locked', walletAddress: wallet })
}
