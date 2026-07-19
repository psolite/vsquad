import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js'
import type * as anchor from '@coral-xyz/anchor'
import type { ConnectedStandardSolanaWallet } from '@privy-io/react-auth/solana'
import { SOLANA_NETWORK } from './network'

const CHAIN = SOLANA_NETWORK === 'mainnet-beta' ? 'solana:mainnet' : (`solana:${SOLANA_NETWORK}` as const)

function serialize(tx: Transaction | VersionedTransaction): Uint8Array {
  return tx instanceof VersionedTransaction
    ? tx.serialize()
    : tx.serialize({ requireAllSignatures: false, verifySignatures: false })
}

function deserializeLike<T extends Transaction | VersionedTransaction>(template: T, bytes: Uint8Array): T {
  return (template instanceof VersionedTransaction
    ? VersionedTransaction.deserialize(bytes)
    : Transaction.from(bytes)) as T
}

/**
 * Wraps a Privy embedded Solana wallet (from `@privy-io/react-auth/solana`'s
 * useWallets()) so it satisfies Anchor's Wallet interface — Privy's wallet
 * object signs raw serialized bytes and returns raw signed bytes, which
 * doesn't match wallet-adapter's Transaction-object-in/out API that
 * AnchorProvider expects, hence this adapter.
 */
export function createPrivySolanaWallet(wallet: ConnectedStandardSolanaWallet): anchor.Wallet {
  const publicKey = new PublicKey(wallet.address)

  return {
    publicKey,
    async signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T> {
      const { signedTransaction } = await wallet.signTransaction({ transaction: serialize(tx), chain: CHAIN })
      return deserializeLike(tx, signedTransaction)
    },
    async signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> {
      const signed: T[] = []
      for (const tx of txs) {
        const { signedTransaction } = await wallet.signTransaction({ transaction: serialize(tx), chain: CHAIN })
        signed.push(deserializeLike(tx, signedTransaction))
      }
      return signed
    },
  } as anchor.Wallet
}
