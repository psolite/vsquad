'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { clusterApiUrl } from '@solana/web3.js'
import { PrivyProvider } from '@privy-io/react-auth'
import { Toaster } from 'react-hot-toast'
import '@solana/wallet-adapter-react-ui/styles.css'

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
  const endpoint = clusterApiUrl('mainnet-beta')
  const wallets  = useMemo(() => [new PhantomWalletAdapter()], [])
  const [queryClient] = useState(() => new QueryClient())
  const [autoConnect] = useState(() => typeof window !== 'undefined' && localStorage.getItem(AUTOCONNECT_KEY) !== 'false')

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
            solana: { createOnLogin: 'off' },
          },
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
