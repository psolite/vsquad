import { NextRequest, NextResponse } from 'next/server'
import { getPrivyUserId, privyClient } from '@/lib/privy'
import { upsertUserFromPrivy } from '@/lib/db'

export async function POST(req: NextRequest) {
  const privyUserId = await getPrivyUserId(req)
  if (!privyUserId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  try {
    const privyUser = await privyClient().getUser(privyUserId)
    const email = privyUser.google?.email ?? null
    const user = await upsertUserFromPrivy(privyUserId, email)
    return NextResponse.json(user)
  } catch (err: unknown) {
    console.error('[auth/sync] failed to sync privy user', privyUserId, err)
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 })
  }
}
