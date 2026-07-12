'use client'
import { useWallet } from '@solana/wallet-adapter-react'
import { usePrivy } from '@privy-io/react-auth'

/**
 * The identifier used everywhere squads/tournaments/points are looked up.
 * Prefers a connected Solana wallet; falls back to a stable synthetic id for
 * users who only signed in with Google, so the whole app works without a
 * wallet. Squads/tournaments/points are just TEXT-keyed by this id server-side
 * — a wallet address and `google:<privyUserId>` are equally valid values.
 */
export function useAccountId() {
  const { publicKey } = useWallet()
  const { ready: privyReady, authenticated, user } = usePrivy()

  const walletId = publicKey?.toBase58() ?? null
  const googleId = authenticated && user ? `google:${user.id}` : null
  const id = walletId ?? googleId
  const ready = privyReady

  return { id, ready }
}
