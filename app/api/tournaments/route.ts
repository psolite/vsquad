import { NextRequest, NextResponse } from 'next/server'
import { listTournaments, createTournament } from '@/lib/db'

export async function GET() {
  const tournaments = await listTournaments()
  return NextResponse.json(tournaments)
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    name?: string; description?: string; prize?: string
    status?: string; startDate?: string; endDate?: string; maxParticipants?: number
  }
  const { name, description, prize, status, startDate, endDate, maxParticipants } = body

  if (!name || !description || !startDate || !endDate) {
    return NextResponse.json({ error: 'name, description, startDate and endDate are required' }, { status: 400 })
  }

  const t = await createTournament({
    name,
    description,
    prize:           prize ?? '',
    status:          (status as 'open' | 'active' | 'ended') ?? 'open',
    startDate,
    endDate,
    maxParticipants: Number(maxParticipants) || 1000,
  })
  return NextResponse.json(t, { status: 201 })
}
