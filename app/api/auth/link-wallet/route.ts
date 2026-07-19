import { NextRequest, NextResponse } from 'next/server'
import { getPrivyUserId } from '@/lib/privy'
import { getUserByPrivyId, linkWalletToUser, migrateAccountId } from '@/lib/db'

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

    // First time this wallet gets linked, carry over whatever squad/points/
    // tournament history exists under the synthetic google:<id> the user was
    // using before they had a real wallet. No-ops harmlessly if there's
    // nothing to migrate (e.g. wallet was already linked, or they never
    // played under the synthetic id).
    await migrateAccountId(`google:${privyUserId}`, walletAddress)
    // Squad cache is keyed by wallet address and only refreshed on save/
    // startup — a migration changes a squad's key without going through the
    // normal save path, so live scoring needs an explicit nudge to see it.
    import('@/lib/services/liveScoring').then((m) => m.refreshSquadCache()).catch(() => {})

    return NextResponse.json(user)
  } catch (err: unknown) {
    console.error('[auth/link-wallet] failed to link wallet for', privyUserId, err)
    return NextResponse.json({ error: 'Failed to link wallet' }, { status: 500 })
  }
}
