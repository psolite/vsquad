import { NextRequest, NextResponse } from 'next/server'
import { getTournament } from '@/lib/db'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const t = await getTournament(id)
  if (!t) return NextResponse.json({ error: 'Tournament not found' }, { status: 404 })
  return NextResponse.json(t)
}
