'use client'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAccountId } from '@/lib/useAccountId'
import { useSquadStore } from '@/store/squadStore'
import { squadApi } from '@/lib/api/squadApi'
import Sidebar from '@/components/Sidebar'
import ConnectModal from '@/components/ConnectModal'

// Every page under this shell is browsable without connecting — a wallet or
// Google account is only needed once the user actually saves/locks a squad.
// This just keeps whichever squad is saved server-side in sync with the local
// store the moment an account id becomes available, no matter which page
// that happens on (e.g. connecting from the sidebar while on /home).
function useSquadHydration() {
  const { id: accountId } = useAccountId()
  const { loadSquad } = useSquadStore()

  const query = useQuery({
    queryKey: ['squad', accountId],
    queryFn: () => squadApi.get(accountId!),
    enabled: !!accountId,
    retry: false,
  })

  useEffect(() => {
    if (query.data) loadSquad(query.data.squad, query.data.squadName, query.data.locked)
  }, [query.data, loadSquad])

  useEffect(() => {
    if (!query.isError) return
    if (query.error instanceof Error && query.error.message === 'Squad not found') return
    console.error('[app] failed to load squad', accountId, query.error)
  }, [query.isError, query.error, accountId])
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false)
  useSquadHydration()

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
        <span className="flex items-center gap-1.75">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="h-5.5 w-5.5 object-contain" />
          <span className="font-black text-[13px] uppercase tracking-[0.12em] leading-none">
            <span className="text-white">V</span><span className="text-accent">SQUAD</span>
          </span>
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

      <ConnectModal />
    </div>
  )
}
