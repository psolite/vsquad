import { Keypair, Connection } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'
import { IDL } from './tournamentProgram'

// Signs initialize_tournament / finalize_tournament / cancel_tournament as
// the tournament program's `authority` — reuses the same server-controlled
// wallet as the TxOdds integration (SERVER_WALLET_SECRET_KEY), rather than a
// second dedicated key. Server-only: this reads a secret env var, so only
// ever import it from API route handlers, never from a 'use client' file.
let _keypair: Keypair | null = null

function getAuthorityKeypair(): Keypair {
  if (_keypair) return _keypair
  const raw = process.env.SERVER_WALLET_SECRET_KEY
  if (!raw) throw new Error('SERVER_WALLET_SECRET_KEY is not set')
  _keypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(raw)))
  return _keypair
}

export function getAuthorityPublicKey(): anchor.web3.PublicKey {
  return getAuthorityKeypair().publicKey
}

export function getAuthorityProgram(connection: Connection): anchor.Program {
  const wallet = new anchor.Wallet(getAuthorityKeypair())
  const provider = new anchor.AnchorProvider(connection, wallet, { commitment: 'confirmed' })
  return new anchor.Program(IDL, provider)
}
