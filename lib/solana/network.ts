import { clusterApiUrl, PublicKey, type Cluster } from '@solana/web3.js'

// The tournament program (lib/solana/tournamentProgram.ts) is currently only
// deployed to devnet — the wallet-adapter connection must point at the same
// cluster the program actually lives on, or every transaction will just fail
// to find the program account. Defaults to devnet for that reason; flip via
// env once/if the program is deployed to mainnet-beta too.
export const SOLANA_NETWORK: Cluster =
  (process.env.NEXT_PUBLIC_SOLANA_NETWORK as Cluster | undefined) ?? 'devnet'

export const SOLANA_RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(SOLANA_NETWORK)

// Receives the flat tournament-creation fee (see CREATION_FEE_LAMPORTS in
// lib/solana/tournamentProgram.ts). Only read when a creator actually submits
// the create-tournament transaction, so a missing/placeholder value doesn't
// break anything else in the app.
export function getTreasuryAddress(): PublicKey {
  const raw = process.env.NEXT_PUBLIC_VSQUAD_TREASURY_ADDRESS
  if (!raw) throw new Error('NEXT_PUBLIC_VSQUAD_TREASURY_ADDRESS is not set')
  return new PublicKey(raw)
}
