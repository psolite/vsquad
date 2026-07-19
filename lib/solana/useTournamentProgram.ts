'use client'
import { useMemo } from 'react'
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react'
import { useWallets as useSolanaStandardWallets } from '@privy-io/react-auth/solana'
import * as anchor from '@coral-xyz/anchor'
import { getTournamentProgram } from './tournamentProgram'
import { createPrivySolanaWallet } from './privyWalletAdapter'

/**
 * Anchor Program client for the tournament program, bound to whichever
 * wallet can actually sign right now:
 *  1. An external wallet-adapter wallet (Phantom, etc.), if connected.
 *  2. Otherwise, the user's Privy embedded Solana wallet (auto-provisioned
 *     for Google sign-ins — see components/Providers.tsx), if present.
 * `null` until one of the two is actually available.
 */
export function useTournamentProgram(): anchor.Program | null {
  const { connection } = useConnection()
  const externalWallet = useAnchorWallet()
  const { wallets: privyWallets } = useSolanaStandardWallets()

  return useMemo(() => {
    if (externalWallet) return getTournamentProgram(connection, externalWallet)
    const privyWallet = privyWallets[0]
    if (privyWallet) return getTournamentProgram(connection, createPrivySolanaWallet(privyWallet))
    return null
  }, [connection, externalWallet, privyWallets])
}
