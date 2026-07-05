import { useMemo } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { clusterApiUrl } from '@solana/web3.js'
import { Toaster } from 'react-hot-toast'
import '@solana/wallet-adapter-react-ui/styles.css'

import Sidebar from './components/Sidebar'
import LandingPage from './pages/LandingPage'
import DashboardHomePage from './pages/DashboardHomePage'
import SquadBuilderPage from './pages/SquadBuilderPage'
import MySquadPage from './pages/MySquadPage'
import TournamentPage from './pages/TournamentPage'
import FixturesPage from './pages/FixturesPage'

function InnerApp() {
  const { pathname } = useLocation()
  const isLanding = pathname === '/' || pathname === ''

  if (isLanding) {
    return <LandingPage />
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0a0e1a' }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<DashboardHomePage />} />
          <Route path="/squad" element={<SquadBuilderPage />} />
          <Route path="/my-squad" element={<MySquadPage />} />
          <Route path="/tournaments" element={<TournamentPage />} />
          <Route path="/fixtures"    element={<FixturesPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  const endpoint = clusterApiUrl('mainnet-beta')
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <BrowserRouter>
            <InnerApp />
            <Toaster
              position="top-right"
              toastOptions={{
                style: { background: '#0f1923', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '13px' },
                success: { iconTheme: { primary: '#00FF87', secondary: '#0a0e1a' } },
                error:   { iconTheme: { primary: '#f87171', secondary: '#0a0e1a' } },
              }}
            />
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
