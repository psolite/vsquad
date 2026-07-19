'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { PrivyProvider } from '@privy-io/react-auth'
import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit'
import { Toaster } from 'react-hot-toast'
import { SOLANA_NETWORK, SOLANA_RPC_ENDPOINT } from '@/lib/solana/network'
import '@solana/wallet-adapter-react-ui/styles.css'

const PRIVY_SOLANA_CHAIN = SOLANA_NETWORK === 'mainnet-beta' ? 'solana:mainnet' : (`solana:${SOLANA_NETWORK}` as const)

const AUTOCONNECT_KEY = 'vsquad-wallet-autoconnect'

// The wallet extension itself remembers the site permission after a plain
// disconnect, so autoConnect would otherwise silently reconnect on the next
// page load even after the user explicitly disconnected. This tracks whether
// that happened so autoConnect can stay off until they reconnect on purpose.
function WalletAutoConnectSync({ children }: { children: React.ReactNode }) {
  const { connected } = useWallet()
  const wasConnected = useRef(false)

  useEffect(() => {
    if (connected) {
      wasConnected.current = true
      localStorage.setItem(AUTOCONNECT_KEY, 'true')
    } else if (wasConnected.current) {
      wasConnected.current = false
      localStorage.setItem(AUTOCONNECT_KEY, 'false')
    }
  }, [connected])

  return children
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const endpoint = SOLANA_RPC_ENDPOINT
  const wallets  = useMemo(() => [new PhantomWalletAdapter()], [])
  const [queryClient] = useState(() => new QueryClient())
  const [autoConnect] = useState(() => typeof window !== 'undefined' && localStorage.getItem(AUTOCONNECT_KEY) !== 'false')

  // Privy's Solana standard-wallet hooks (what our embedded-wallet signing
  // adapter calls under the hood) need an RPC configured per chain — without
  // it, embedded wallet creation/signing can hang instead of failing loudly.
  // Built lazily, client-side only: rpcSubscriptions opens a real WebSocket,
  // which must never happen during SSR (this whole file runs its top-level
  // render once on the server too, even though it's 'use client') — building
  // it unconditionally there is what broke wallet connect entirely.
  const solanaConfig = useMemo(() => {
    if (typeof window === 'undefined') return undefined
    return {
      rpcs: {
        [PRIVY_SOLANA_CHAIN]: {
          rpc: createSolanaRpc(SOLANA_RPC_ENDPOINT),
          rpcSubscriptions: createSolanaRpcSubscriptions(SOLANA_RPC_ENDPOINT.replace(/^http/, 'ws')),
        },
      },
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
        config={{
          loginMethods: ['google'],
          appearance: {
            theme: 'dark',
            accentColor: '#00FF87',
            landingHeader: 'Sign in to VSquad',
          },
          embeddedWallets: {
            ethereum: { createOnLogin: 'off' },
            // Google-only sign-ins previously had no Solana wallet at all —
            // 'users-without-wallets' auto-provisions one so they can pay
            // real on-chain fees (tournament entry, etc.) too, without ever
            // installing Phantom. Users who connect an external wallet don't
            // get a redundant embedded one.
            solana: { createOnLogin: 'users-without-wallets' },
          },
          solana: solanaConfig,
        }}
      >
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect={autoConnect}>
            <WalletModalProvider>
              <WalletAutoConnectSync>
                <Toaster position="top-center" toastOptions={{ style: { background: '#0f1923', color: '#fff', border: '1px solid rgba(255,255,255,0.08)' } }} />
                {children}
              </WalletAutoConnectSync>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </PrivyProvider>
    </QueryClientProvider>
  )
}
