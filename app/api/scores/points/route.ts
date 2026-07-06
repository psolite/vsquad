import { NextResponse } from 'next/server'
import { POINTS } from '@/lib/services/liveScoring'

export async function GET() {
  return NextResponse.json(POINTS)
}
