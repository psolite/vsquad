import * as anchor from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import type { AnchorWallet } from '@solana/wallet-adapter-react'
import idlJson from './idl/tournament_program.json'

// This IDL was pulled straight from the deployed devnet program via
// `anchor idl fetch` (not generated locally — this environment's Rust
// toolchain can't link on this machine, see program-docs/ for the note).
// If anchor build ever runs successfully against program/, prefer
// regenerating this file from target/idl/program.json instead of hand-editing
// it, so it never drifts from what's actually on-chain.
export const IDL = idlJson as anchor.Idl
export const PROGRAM_ID = new PublicKey(idlJson.address)

// Flat platform fee charged to a creator when they create a tournament,
// separate from (and in addition to) the tournament's own entry fee. Paid to
// getTreasuryAddress() (lib/solana/network.ts), not into the prize vault.
export const CREATION_FEE_LAMPORTS = 10_000_000 // 0.01 SOL

const TOURNAMENT_SEED = Buffer.from('tournament')
const ENTRY_SEED = Buffer.from('entry')
const DUEL_SEED = Buffer.from('duel')

function u64LeBytes(value: bigint | number): Buffer {
  const buf = Buffer.alloc(8)
  buf.writeBigUInt64LE(BigInt(value))
  return buf
}

export function deriveTournamentPda(tournamentId: bigint | number): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [TOURNAMENT_SEED, u64LeBytes(tournamentId)],
    PROGRAM_ID,
  )
}

export function deriveEntryPda(tournament: PublicKey, wallet: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [ENTRY_SEED, tournament.toBuffer(), wallet.toBuffer()],
    PROGRAM_ID,
  )
}

export function deriveDuelPda(duelId: bigint | number): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [DUEL_SEED, u64LeBytes(duelId)],
    PROGRAM_ID,
  )
}

/**
 * Builds an Anchor Program client for the tournament program, bound to
 * whichever wallet is currently connected via wallet-adapter.
 *
 * Takes @solana/wallet-adapter-react's `AnchorWallet` (from `useAnchorWallet()`)
 * rather than anchor.Wallet directly — a real anchor.Wallet additionally
 * requires a `payer: Keypair`, which no browser extension wallet can ever
 * provide (that would mean exposing the private key to the dApp). The cast
 * below is the standard, safe pattern for this: AnchorProvider only ever
 * calls publicKey/signTransaction/signAllTransactions on it, never `.payer`,
 * for anything this app does (no local/CLI-style signing).
 */
export function getTournamentProgram(
  connection: anchor.web3.Connection,
  wallet: AnchorWallet,
): anchor.Program {
  const provider = new anchor.AnchorProvider(connection, wallet as anchor.Wallet, {
    commitment: 'confirmed',
  })
  return new anchor.Program(IDL, provider)
}

// ── Mirrors of the on-chain account shapes (program/programs/program/src/state.rs) ──
// Hand-typed rather than derived from the loosely-typed IDL import above, so
// application code gets real autocomplete/type-checking on fetched account data.

export type TournamentStatus =
  | { open: Record<string, never> }
  | { locked: Record<string, never> }
  | { finalized: Record<string, never> }
  | { cancelled: Record<string, never> }

export type DuelStatus =
  | { open: Record<string, never> }
  | { active: Record<string, never> }
  | { finalized: Record<string, never> }
  | { cancelled: Record<string, never> }

export type DuelResult =
  | { winner: [PublicKey] }
  | { draw: Record<string, never> }

export interface PayoutShare {
  rank: number
  basisPoints: number
}

export interface Standing {
  wallet: PublicKey
  rank: number
}

export interface TournamentAccount {
  authority: PublicKey
  tournamentId: anchor.BN
  entryFee: anchor.BN
  maxParticipants: number
  participantCount: number
  startTime: anchor.BN
  endTime: anchor.BN
  status: TournamentStatus
  finalPoolLamports: anchor.BN
  vaultBump: number
  bump: number
  payoutTable: PayoutShare[]
  finalStandings: Standing[]
}

export interface EntryAccount {
  tournament: PublicKey
  wallet: PublicKey
  joinedAt: anchor.BN
  claimed: boolean
  bump: number
}

export interface DuelAccount {
  authority: PublicKey
  duelId: anchor.BN
  stake: anchor.BN
  challenger: PublicKey
  opponent: PublicKey | null
  startTime: anchor.BN
  endTime: anchor.BN
  status: DuelStatus
  result: DuelResult | null
  challengerClaimed: boolean
  opponentClaimed: boolean
  bump: number
}
