'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { usePrivy } from '@privy-io/react-auth'
import Sidebar from '@/components/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false)
  const router = useRouter()
  const { connected, connecting } = useWallet()
  const { ready: privyReady, authenticated } = usePrivy()
  const signedIn = connected || authenticated

  useEffect(() => {
    // While a wallet reconnect attempt is actively in flight, don't even start
    // the grace timer — wallet extensions announce themselves asynchronously
    // and can take a while, so bail out here instead of racing a fixed delay.
    if (!privyReady || signedIn || connecting) return
    const t = setTimeout(() => {
      router.push('/')
    }, 1200)
    return () => clearTimeout(t)
  }, [privyReady, signedIn, connecting, router])

  if (!privyReady || !signedIn) return null

  return (
    <div className="flex h-svh overflow-hidden bg-bg max-[900px]:flex-col">

      <div className="hidden max-[900px]:flex items-center gap-3 h-13 shrink-0 px-3.5 bg-[#080c18] border-b border-white/6 relative z-30">
        <button
          onClick={() => setNavOpen(true)}
          aria-label="Open navigation"
          className="bg-transparent border-none cursor-pointer text-white/70 p-1.5 flex items-center"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <span className="font-black text-[13px] uppercase tracking-[0.12em] leading-none">
          <span className="text-white">V</span><span className="text-accent">SQUAD</span>
        </span>
      </div>

      <div
        className={navOpen ? "fixed inset-0 z-90 bg-black/60 backdrop-blur-[2px]" : "hidden"}
        onClick={() => setNavOpen(false)}
      />

      <Sidebar mobileOpen={navOpen} onNavigate={() => setNavOpen(false)} />

      <div className="flex-1 overflow-hidden flex flex-col min-w-0 max-[900px]:min-h-0">
        {children}
      </div>
    </div>
  )
}
