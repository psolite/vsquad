import axios from 'axios'
import nacl from 'tweetnacl'
import { Connection, Keypair, PublicKey, SystemProgram } from '@solana/web3.js'
import { Program, AnchorProvider, Wallet } from '@coral-xyz/anchor'
import { getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount, TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { idl as TXLINE_IDL } from './TXLINE_IDL'
import { cfg } from './config'

// ── Wallet ────────────────────────────────────────────────────────────────────

function loadServerKeypair(): Keypair {
  const raw = process.env.SERVER_WALLET_SECRET_KEY
  if (!raw) throw new Error('SERVER_WALLET_SECRET_KEY not set in .env')
  return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(raw) as number[]))
}

// ── Step 1: Guest JWT ─────────────────────────────────────────────────────────

async function getGuestJwt(): Promise<string> {
  const { origin } = cfg()
  const url = `${origin}/auth/guest/start`
  console.log('[txodds] POST', url)
  try {
    const { data } = await axios.post<{ token: string }>(url)
    return data.token
  } catch (err: any) {
    const detail = err.response
      ? `${err.response.status} ${JSON.stringify(err.response.data)}`
      : err.message
    throw new Error(`getGuestJwt failed: ${detail}`)
  }
}

// ── Step 2: On-chain subscription ─────────────────────────────────────────────

async function subscribeOnChain(keypair: Keypair): Promise<string> {
  const { rpcUrl, programId, txlMint, serviceLevel, durationWeeks } = cfg()

  const connection = new Connection(rpcUrl, 'confirmed')
  const provider   = new AnchorProvider(connection, new Wallet(keypair), { commitment: 'confirmed' })
  const progPubkey = new PublicKey(programId)
  const mintPubkey = new PublicKey(txlMint)

  console.log('[txodds] RPC:', rpcUrl)
  console.log('[txodds] program:', programId)
  console.log('[txodds] mint:', txlMint)

  const [pricingMatrix]   = PublicKey.findProgramAddressSync([Buffer.from('pricing_matrix')],   progPubkey)
  const [tokenTreasuryPda] = PublicKey.findProgramAddressSync([Buffer.from('token_treasury_v2')], progPubkey)

  // Create ATA if missing — program requires it pre-initialized
  const { address: userTokenAccount } = await getOrCreateAssociatedTokenAccount(
    connection, keypair, mintPubkey, keypair.publicKey,
    false, 'confirmed', {}, TOKEN_2022_PROGRAM_ID
  )
  const tokenTreasuryVault = await getAssociatedTokenAddress(
    mintPubkey, tokenTreasuryPda, true, TOKEN_2022_PROGRAM_ID
  )

  const program = new Program(TXLINE_IDL as any, provider)

  // service_level_id is u16, weeks is u8 — plain numbers, not BN
  const txSig = await (program.methods as any)
    .subscribe(serviceLevel, durationWeeks)
    .accounts({
      user:                   keypair.publicKey,
      pricingMatrix,
      tokenMint:              mintPubkey,
      userTokenAccount,
      tokenTreasuryVault,
      tokenTreasuryPda,
      tokenProgram:           TOKEN_2022_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram:          SystemProgram.programId,
    })
    .rpc()

  return txSig as string
}

// ── Step 3: Activate API token ────────────────────────────────────────────────

async function activateApiToken(jwt: string, txSig: string, keypair: Keypair): Promise<string> {
  const { apiBase } = cfg()
  // Leagues are baked into the pricing matrix row — pass empty array
  const leagues: number[] = []
  const message   = `${txSig}:${leagues.join(',')}:${jwt}`
  const sigBytes  = nacl.sign.detached(Buffer.from(message), keypair.secretKey)
  const walletSig = Buffer.from(sigBytes).toString('base64')

  const url  = `${apiBase}/token/activate`
  const body = { txSig, walletSignature: walletSig, leagues }
  console.log('[txodds] POST', url, JSON.stringify(body).slice(0, 120))
  try {
    const { data } = await axios.post<string>(url, body, {
      headers: { Authorization: `Bearer ${jwt}` },
    })
    // API returns the token as a bare string
    const token = typeof data === 'string' ? data : (data as any).token
    if (!token) throw new Error(`no token in response: ${JSON.stringify(data)}`)
    return token
  } catch (err: any) {
    const detail = err.response
      ? `${err.response.status} ${JSON.stringify(err.response.data)}`
      : err.message
    throw new Error(`activateApiToken failed: ${detail}`)
  }
}

// ── Full auth flow ────────────────────────────────────────────────────────────

export async function authenticate(): Promise<{ jwt: string; apiToken: string }> {
  const keypair = loadServerKeypair()
  const { isDevnet } = cfg()
  console.log('[txodds] network:', isDevnet ? 'devnet' : 'mainnet')
  console.log('[txodds] wallet:', keypair.publicKey.toBase58())

  console.log('[txodds] step 1 — guest JWT')
  const jwt = await getGuestJwt()
  console.log('[txodds] step 1 done')

  console.log('[txodds] step 2 — on-chain subscription')
  let txSig: string
  try {
    txSig = await subscribeOnChain(keypair)
    console.log('[txodds] step 2 done, txSig:', txSig)
  } catch (err: any) {
    throw new Error(`subscribeOnChain failed: ${err.message}`)
  }

  console.log('[txodds] step 3 — activate API token')
  const apiToken = await activateApiToken(jwt, txSig, keypair)
  console.log('[txodds] step 3 done — token:', apiToken)

  return { jwt, apiToken }
}
