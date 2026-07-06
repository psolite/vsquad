import { NextResponse } from 'next/server'
import { getDiscoveredPlayers } from '@/lib/services/liveScoring'

export async function GET() {
  return NextResponse.json(getDiscoveredPlayers())
}
