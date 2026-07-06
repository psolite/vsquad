import { NextRequest, NextResponse } from 'next/server'
import { upsertSquad } from '@/lib/db'
import type { Player } from '@/lib/db'
import { refreshSquadCache } from '@/lib/services/liveScoring'

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

  const saved = await upsertSquad({ walletAddress, squadName, squad, locked })
  // Refresh in-memory squad cache so leaderboard stays accurate
  refreshSquadCache().catch(() => {})
  return NextResponse.json(saved, { status: 201 })
}
