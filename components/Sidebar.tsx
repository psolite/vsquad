'use client'
import Link from 'next/link'
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Wallet } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { usePrivy } from '@privy-io/react-auth'
import { useConnectModalStore } from '@/store/connectModalStore'
import { scoresApi } from '@/lib/api/scoresApi'
import type { MatchLiveScore } from '@/lib/api/scoresApi'

function HomeIcon()     { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> }
function SquadIcon()    { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
function TrophyIcon()   { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> }
function CalendarIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }

const NAV_ITEMS = [
  { href: '/home',        label: 'Home',        Icon: HomeIcon     },
  { href: '/my-squad',   label: 'My Squad',    Icon: SquadIcon    },
  { href: '/tournaments', label: 'Tournaments', Icon: TrophyIcon   },
  { href: '/fixtures',    label: 'Fixtures',    Icon: CalendarIcon },
]

function shortKey(key: string) { return `${key.slice(0, 4)}…${key.slice(-4)}` }

const noopSubscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

// ── Live Scores Widget ────────────────────────────────────────────────────────

function LiveScoresWidget() {
  const [liveMap, setLiveMap] = useState<Record<string, MatchLiveScore>>({})

  const { data, error } = useQuery({
    queryKey: ['matches'],
    queryFn: scoresApi.matches,
  })
  const fixtures = useMemo(() => [...(data?.live ?? []), ...(data?.today ?? [])], [data])

  useEffect(() => {
    if (error) console.error('[sidebar] failed to load matches', error)
  }, [error])

  useEffect(() => {
    return scoresApi.subscribeToLive({
      onMatchScores: (scores) => {
        setLiveMap((prev) => {
          const next = { ...prev }
          for (const s of scores) next[s.fixtureId] = s
          return next
        })
      },
      onMatchScore: (s) => setLiveMap((prev) => ({ ...prev, [s.fixtureId]: s })),
    })
  }, [])

  const liveFixtures = fixtures.filter(f => liveMap[f.fixtureId]?.matchStatus === 'live' || f.status === 'live')
  if (liveFixtures.length === 0) return null

  return (
    <div className="px-3 pb-2.5 shrink-0">
      <div className="border-t border-white/5 pt-3.5">
        <div className="flex items-center gap-1.5 mb-2 pl-1">
          <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_#00FF87] shrink-0" />
          <span className="text-white/70 text-[9px] font-extrabold uppercase tracking-[0.18em]">Live Now</span>
          <span className="ml-auto bg-accent/12 text-accent text-[9px] font-black py-px px-1.5 rounded-md">{liveFixtures.length}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {liveFixtures.slice(0, 3).map((f) => {
            const s = liveMap[f.fixtureId]
            const h = s?.homeScore ?? f.homeScore
            const a = s?.awayScore ?? f.awayScore
            const min = s?.minute ?? f.minute
            return (
              <div key={f.fixtureId} className="bg-accent/5 border border-accent/12 rounded-[9px] py-1.5 px-2.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-white/70 text-[10px] font-bold flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {f.homeTeam.slice(0, 3).toUpperCase()}
                  </span>
                  <span className="text-accent text-[13px] font-black tracking-[-0.02em] shrink-0">
                    {h !== null && a !== null ? `${h}–${a}` : '–'}
                  </span>
                  <span className="text-white/70 text-[10px] font-bold flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-right">
                    {f.awayTeam.slice(0, 3).toUpperCase()}
                  </span>
                </div>
                {min != null && (
                  <div className="text-center mt-0.5">
                    <span className="text-accent/50 text-[9px] font-bold">{min}&apos;</span>
                  </div>
                )}
              </div>
            )
          })}
          {liveFixtures.length > 3 && (
            <p className="text-white/70 text-[9px] text-center m-0">+{liveFixtures.length - 3} more</p>
          )}
        </div>
      </div>
    </div>
  )
}

interface SidebarProps {
  mobileOpen?: boolean
  onNavigate?: () => void
}

export default function Sidebar({ mobileOpen = false, onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const { publicKey, connected, disconnect } = useWallet()
  const { ready: privyReady, authenticated, user, logout } = usePrivy()
  const openConnectModal = useConnectModalStore((s) => s.open)
  const mounted = useSyncExternalStore(noopSubscribe, getClientSnapshot, getServerSnapshot)
  const signedIn = connected || authenticated

  return (
    <aside
      className={`flex flex-col w-55 shrink-0 bg-[linear-gradient(180deg,#080c18_0%,#070a14_100%)] border-r border-white/6 relative z-10 min-[901px]:h-svh max-[900px]:fixed max-[900px]:top-0 max-[900px]:left-0 max-[900px]:bottom-0 max-[900px]:w-62.5 max-[900px]:max-w-[82vw] max-[900px]:overflow-y-auto max-[900px]:transition-transform max-[900px]:duration-[250ms] max-[900px]:z-100 ${mobileOpen ? "max-[900px]:translate-x-0" : "max-[900px]:-translate-x-full"}`}
    >

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="py-5 px-4.5 pb-4.5 border-b border-white/5 shrink-0"
      >
        <Link href="/home" onClick={onNavigate} className="flex items-center gap-2.5 no-underline">
          <div className="w-8.5 h-8.5 rounded-[9px] bg-accent/10 border border-accent/18 flex items-center justify-center shrink-0 p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" className="w-full h-full object-contain" />
          </div>
          <span className="font-black text-[15px] uppercase tracking-[0.14em] leading-none">
            <span className="text-white">V</span><span className="text-accent">SQUAD</span>
          </span>
        </Link>
        <div className="mt-2.5 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_#00FF87]" />
          <span className="text-white/70 text-[9.5px] font-bold uppercase tracking-[0.18em]">5-a-Side Fantasy Football</span>
        </div>
      </motion.div>

      {/* Nav */}
      <div className="flex-1 py-4 px-3 overflow-y-auto min-h-0">
        <p className="text-white/70 text-[9px] font-extrabold uppercase tracking-[0.2em] mb-2 pl-2">Navigation</p>

        <nav className="flex flex-col gap-[3px]">
          {NAV_ITEMS.map(({ href, label, Icon }, i) => {
            const active = pathname === href
            return (
              <motion.div
                key={href}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Link
                  href={href}
                  onClick={onNavigate}
                  className={`flex items-center gap-2.75 py-2.5 px-3 rounded-[10px] no-underline text-[13px] tracking-[0.01em] transition-colors duration-150 relative ${
                    active
                      ? "text-accent bg-accent/8 border border-accent/15 font-extrabold"
                      : "text-white/70 bg-transparent border border-transparent font-medium hover:text-white hover:bg-white/4 hover:border-white/6"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-[60%] rounded-[0_3px_3px_0] bg-accent"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                  <Icon />
                  {label}
                </Link>
              </motion.div>
            )
          })}
        </nav>
      </div>

      {/* Live Scores */}
      <LiveScoresWidget />

      {/* Account */}
      <div className="py-3.5 px-3.5 pb-4.5 border-t border-white/5 shrink-0">
        {mounted && privyReady && authenticated && (
          <div className="bg-white/3 border border-white/7 rounded-[10px] py-2.5 px-3 mb-2 flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-white/70 text-[9px] font-bold uppercase tracking-[0.12em] mb-px">Signed in</p>
              <p className="text-white text-[11px] font-bold overflow-hidden text-ellipsis whitespace-nowrap">{user?.google?.email ?? 'Google account'}</p>
            </div>
            <button
              onClick={() => logout()}
              className="shrink-0 bg-transparent border-none cursor-pointer text-white/70 text-[10px] font-extrabold uppercase tracking-[0.06em] hover:text-red-400"
            >
              Sign out
            </button>
          </div>
        )}
        {mounted && connected && publicKey && (
          <div className="bg-white/3 border border-white/7 rounded-[10px] py-2.5 px-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg shrink-0 bg-accent/15 border border-accent/20 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00FF87" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white/70 text-[9px] font-bold uppercase tracking-[0.12em] mb-px">Connected</p>
              <p className="text-white text-[11px] font-bold font-mono overflow-hidden text-ellipsis whitespace-nowrap">{shortKey(publicKey.toBase58())}</p>
            </div>
            <button
              onClick={() => disconnect()}
              className="shrink-0 bg-transparent border-none cursor-pointer text-white/70 text-[10px] font-extrabold uppercase tracking-[0.06em] hover:text-red-400"
            >
              Disconnect
            </button>
          </div>
        )}
        {mounted && !signedIn && (
          <button
            onClick={openConnectModal}
            className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-bg py-2.5 rounded-[10px] font-black text-xs uppercase tracking-widest border-none cursor-pointer transition-colors"
          >
            <Wallet size={14} />
            Connect
          </button>
        )}
      </div>
    </aside>
  )
}
