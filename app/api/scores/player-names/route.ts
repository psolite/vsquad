import { NextResponse } from 'next/server'
import { getPlayerNames } from '@/lib/services/liveScoring'

export async function GET() {
  return NextResponse.json(getPlayerNames())
}
