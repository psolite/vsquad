import { NextResponse } from 'next/server'
import { buildLeaderboard } from '@/lib/services/liveScoring'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(buildLeaderboard())
}
