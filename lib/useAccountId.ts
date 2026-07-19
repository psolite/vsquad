'use client'
import { useWallet } from '@solana/wallet-adapter-react'
import { usePrivy } from '@privy-io/react-auth'
import { useWallets as useSolanaStandardWallets } from '@privy-io/react-auth/solana'

/**
 * The identifier used everywhere squads/tournaments/points are looked up.
 * Prefers a connected external Solana wallet, then a Privy embedded Solana
 * wallet (auto-provisioned for Google sign-ins — see components/Providers.tsx),
 * then falls back to a stable synthetic id for the rare case neither exists
 * yet, so the whole app still works. Squads/tournaments/points are just
 * TEXT-keyed by this id server-side — any of the three forms is valid, and
 * lib/db.ts's migrateAccountId() carries a user's history from the synthetic
 * id over to their real wallet the moment one shows up (app/api/auth/link-wallet).
 */
export function useAccountId() {
  const { publicKey } = useWallet()
  const { ready: privyReady, authenticated, user } = usePrivy()
  const { ready: solanaWalletsReady, wallets: privySolanaWallets } = useSolanaStandardWallets()

  const walletId = publicKey?.toBase58() ?? null
  const embeddedWalletId = privySolanaWallets[0]?.address ?? null
  const googleId = authenticated && user ? `google:${user.id}` : null
  const id = walletId ?? embeddedWalletId ?? googleId
  const ready = privyReady && solanaWalletsReady

  return { id, ready }
}
