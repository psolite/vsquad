import { NextRequest, NextResponse } from 'next/server'
import { upsertSquad } from '@/lib/db'
import type { Player } from '@/lib/db'

interface SquadBody {
  walletAddress: string
  squadName?: string
  squad: { gk: Player; def1: Player; def2: Player; fwd1: Player; fwd2: Player }
  locked?: boolean
}

export async function POST(req: NextRequest) {
  const body = await req.json() as SquadBody
  const { walletAddress, squadName = '', squad, locked = false } = body

  if (!walletAddress || !squad?.gk || !squad?.def1 || !squad?.def2 || !squad?.fwd1 || !squad?.fwd2) {
    return NextResponse.json({ error: 'walletAddress and all 5 squad slots are required' }, { status: 400 })
  }

  try {
    const saved = await upsertSquad({ walletAddress, squadName, squad, locked })
    // Refresh in-memory squad cache so leaderboard stays accurate. Loaded
    // lazily — this pulls in the whole TxOdds/Solana toolchain, which has no
    // business being a hard dependency of "save a squad to Postgres".
    import('@/lib/services/liveScoring').then((m) => m.refreshSquadCache()).catch((err) => console.error('[squads] refreshSquadCache failed:', err))
    return NextResponse.json(saved, { status: 201 })
  } catch (err: unknown) {
    console.error('[squads] failed to save squad for wallet', walletAddress, err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to save squad' }, { status: 500 })
  }
}
