import { NextRequest, NextResponse } from 'next/server'
import { getPrivyUserId } from '@/lib/privy'
import { getUserByPrivyId, linkWalletToUser } from '@/lib/db'

export async function POST(req: NextRequest) {
  const privyUserId = await getPrivyUserId(req)
  if (!privyUserId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { walletAddress } = await req.json() as { walletAddress?: string }
  if (!walletAddress) return NextResponse.json({ error: 'walletAddress is required' }, { status: 400 })

  try {
    const existing = await getUserByPrivyId(privyUserId)
    if (!existing) return NextResponse.json({ error: 'User not found — sync first' }, { status: 404 })
    if (existing.walletAddress && existing.walletAddress !== walletAddress) {
      return NextResponse.json({ error: 'A different wallet is already linked to this account' }, { status: 409 })
    }

    const user = await linkWalletToUser(privyUserId, walletAddress)
    if (!user) return NextResponse.json({ error: 'Failed to link wallet' }, { status: 409 })
    return NextResponse.json(user)
  } catch (err: unknown) {
    console.error('[auth/link-wallet] failed to link wallet for', privyUserId, err)
    return NextResponse.json({ error: 'Failed to link wallet' }, { status: 500 })
  }
}
