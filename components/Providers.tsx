'use client'
import { useMemo, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { clusterApiUrl } from '@solana/web3.js'
import { PrivyProvider } from '@privy-io/react-auth'
import { Toaster } from 'react-hot-toast'
import '@solana/wallet-adapter-react-ui/styles.css'

export default function Providers({ children }: { children: React.ReactNode }) {
  const endpoint = clusterApiUrl('mainnet-beta')
  const wallets  = useMemo(() => [new PhantomWalletAdapter()], [])
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
        config={{
          loginMethods: ['email', 'google'],
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
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <Toaster position="top-center" toastOptions={{ style: { background: '#0f1923', color: '#fff', border: '1px solid rgba(255,255,255,0.08)' } }} />
              {children}
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </PrivyProvider>
    </QueryClientProvider>
  )
}
