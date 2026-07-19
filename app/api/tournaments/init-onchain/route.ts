import { NextRequest, NextResponse } from 'next/server'
import { Connection, SystemProgram } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'
import { getAuthorityProgram, getAuthorityPublicKey } from '@/lib/solana/authority'
import { deriveTournamentPda } from '@/lib/solana/tournamentProgram'
import { SOLANA_RPC_ENDPOINT } from '@/lib/solana/network'
import { createTournament, type TournamentPayoutShare } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface InitOnChainBody {
  name?: string
  description?: string
  prize?: string
  startDate?: string
  endDate?: string
  maxParticipants?: number
  entryFeeLamports?: number
  payoutTable?: TournamentPayoutShare[]
}

// Creates a tournament backed by a real on-chain entry fee/prize vault:
// 1. Backend (as the program's fixed `authority`) signs initialize_tournament.
// 2. The resulting on-chain link is persisted to Postgres.
// The creator's own 0.01 SOL creation fee + their entry-fee payment/auto-join
// happen client-side afterward (components/.../CreateTournamentModal — the
// creator's wallet has to sign those, the backend never touches their funds).
export async function POST(req: NextRequest) {
  const body = await req.json() as InitOnChainBody
  const { name, description, prize, startDate, endDate, maxParticipants, entryFeeLamports, payoutTable } = body

  if (!name || !description || !startDate || !endDate) {
    return NextResponse.json({ error: 'name, description, startDate and endDate are required' }, { status: 400 })
  }
  if (!entryFeeLamports || entryFeeLamports <= 0) {
    return NextResponse.json({ error: 'entryFeeLamports must be greater than zero' }, { status: 400 })
  }
  if (!payoutTable || payoutTable.length === 0) {
    return NextResponse.json({ error: 'payoutTable must have at least one entry' }, { status: 400 })
  }
  const totalBasisPoints = payoutTable.reduce((sum, share) => sum + share.basisPoints, 0)
  if (totalBasisPoints !== 10_000) {
    return NextResponse.json({ error: 'payoutTable basisPoints must sum to exactly 10,000' }, { status: 400 })
  }
  const maxP = Number(maxParticipants) || 1000

  const startTimeSec = Math.floor(new Date(startDate).getTime() / 1000)
  const endTimeSec = Math.floor(new Date(endDate).getTime() / 1000)
  if (!(endTimeSec > startTimeSec) || startTimeSec <= Math.floor(Date.now() / 1000)) {
    return NextResponse.json({ error: 'startDate must be in the future and endDate must be after startDate' }, { status: 400 })
  }

  try {
    const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed')
    const program = getAuthorityProgram(connection)
    const authority = getAuthorityPublicKey()

    // Millisecond timestamp is unique per creation and comfortably fits a u64
    // (and a JS-safe integer, so no precision loss going through anchor.BN).
    const tournamentId = Date.now()
    const [tournamentPda] = deriveTournamentPda(tournamentId)

    await program.methods
      .initializeTournament(
        new anchor.BN(tournamentId),
        new anchor.BN(entryFeeLamports),
        maxP,
        new anchor.BN(startTimeSec),
        new anchor.BN(endTimeSec),
        payoutTable.map((share) => ({ rank: share.rank, basisPoints: share.basisPoints })),
      )
      .accounts({
        authority,
        tournament: tournamentPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    const t = await createTournament({
      name,
      description,
      prize: prize ?? '',
      status: 'open',
      startDate,
      endDate,
      maxParticipants: maxP,
      onChainId: tournamentId,
      tournamentPda: tournamentPda.toBase58(),
      entryFeeLamports,
      payoutTable,
    })

    return NextResponse.json(t, { status: 201 })
  } catch (err: unknown) {
    console.error('[tournaments] failed to initialize on-chain tournament', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create on-chain tournament' },
      { status: 500 },
    )
  }
}
