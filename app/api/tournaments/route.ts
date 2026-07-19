import { NextRequest, NextResponse } from 'next/server'
import { listTournaments, createTournament, type TournamentPayoutShare } from '@/lib/db'

export async function GET() {
  const tournaments = await listTournaments()
  return NextResponse.json(tournaments)
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    name?: string; description?: string; prize?: string
    status?: string; startDate?: string; endDate?: string; maxParticipants?: number
    // Set once the creator's wallet has already sent (and confirmed) the
    // on-chain initialize_tournament transaction — this call just persists
    // the link. Omit all four to create a plain off-chain tournament (no
    // entry fee/escrow), which stays fully supported.
    onChainId?: number; tournamentPda?: string; entryFeeLamports?: number
    payoutTable?: TournamentPayoutShare[]
  }
  const {
    name, description, prize, status, startDate, endDate, maxParticipants,
    onChainId, tournamentPda, entryFeeLamports, payoutTable,
  } = body

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
    onChainId,
    tournamentPda,
    entryFeeLamports,
    payoutTable,
  })
  return NextResponse.json(t, { status: 201 })
}
