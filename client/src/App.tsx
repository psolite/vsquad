import { useMemo } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { clusterApiUrl } from '@solana/web3.js'
import '@solana/wallet-adapter-react-ui/styles.css'

import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import SquadBuilderPage from './pages/SquadBuilderPage'
import MySquadPage from './pages/MySquadPage'
import TournamentPage from './pages/TournamentPage'

export default function App() {
  const endpoint = clusterApiUrl('mainnet-beta')
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <BrowserRouter>
            <div className="relative flex flex-col h-screen overflow-hidden bg-[#0a0e1a]">
              <Navbar />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/squad" element={<SquadBuilderPage />} />
                <Route path="/my-squad" element={<MySquadPage />} />
                <Route path="/tournaments" element={<TournamentPage />} />
              </Routes>
            </div>
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
