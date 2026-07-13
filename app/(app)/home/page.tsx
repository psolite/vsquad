'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { useWallet } from '@solana/wallet-adapter-react'
import { Zap, Trophy, TrendingUp, Users, Shirt, Radio, ArrowRight } from 'lucide-react'
import { useAccountId } from '@/lib/useAccountId'
import { useSquadStore, filledCount, isComplete } from '@/store/squadStore'
import { scoresApi } from '@/lib/api/scoresApi'
import type { SquadLiveScore, MatchLiveScore } from '@/lib/api/scoresApi'
import { resolveTeam } from '@/lib/resolveTeam'
import Pitch from '@/components/Pitch'
import FlagImg from '@/components/FlagImg'

const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

function fmtKickoff(ms: number) {
  const d = new Date(ms)
  const now = new Date()
  const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1)
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  if (d.toDateString() === now.toDateString()) return time
  if (d.toDateString() === tomorrow.toDateString()) return `Tomorrow, ${time}`
  return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${time}`
}

function MatchBadge({ status }: { status: 'upcoming' | 'live' | 'finished' }) {
  if (status === 'live') return <span className="flex items-center gap-1 text-accent text-[10px] font-extrabold"><span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_#00FF87] inline-block" />LIVE</span>
  if (status === 'finished') return <span className="text-white/70 text-[10px] font-bold">FT</span>
  return <span className="text-white/70 text-[10px] font-bold">Soon</span>
}

function StatCard({ icon: Icon, label, value, sub, accent }: { icon: React.ElementType; label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-[18px] py-5 px-5.5 ${accent ? 'bg-[linear-gradient(135deg,rgba(0,255,135,0.1)_0%,rgba(0,255,135,0.04)_100%)] border border-accent/25' : 'bg-white/3 border border-white/10'}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center shrink-0 ${accent ? 'bg-accent/15 text-accent' : 'bg-white/8 text-white/70'}`}>
          <Icon size={13} />
        </div>
        <p className={`text-[9.5px] font-extrabold uppercase tracking-[0.18em] ${accent ? 'text-accent/70' : 'text-white/70'}`}>{label}</p>
      </div>
      <div className="flex items-end gap-1.5 leading-none">
        <span className={`text-4xl font-black leading-none tracking-[-0.02em] ${accent ? 'text-accent' : 'text-white'}`}>{value}</span>
      </div>
      {sub && <p className="text-white/70 text-[10.5px] font-medium mt-2">{sub}</p>}
    </div>
  )
}

export default function DashboardHomePage() {
  const { id: accountId } = useAccountId()
  const { publicKey } = useWallet()
  const { squad, squadName } = useSquadStore()
  const wallet = accountId
  const displayLabel = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}…${publicKey.toBase58().slice(-4)}`
    : null

  const todayQuery = useQuery({
    queryKey: ['points', wallet, 'today'],
    queryFn: () => scoresApi.points(wallet!, 'today'),
    enabled: !!wallet,
    retry: false,
  })
  const totalQuery = useQuery({
    queryKey: ['points', wallet, 'total'],
    queryFn: () => scoresApi.points(wallet!, 'total'),
    enabled: !!wallet,
    retry: false,
  })
  const matchesQuery = useQuery({ queryKey: ['matches'], queryFn: scoresApi.matches })
  const leaderboardQuery = useQuery({ queryKey: ['leaderboard'], queryFn: scoresApi.leaderboard })

  const [todayPoints,   setTodayPoints]   = useState<Record<string, number>>({})
  const [myLeaderboard, setMyLeaderboard] = useState<SquadLiveScore | null>(null)
  const [liveMap,       setLiveMap]       = useState<Record<string, MatchLiveScore>>({})

  const totalPoints = totalQuery.data ?? {}
  const matches      = matchesQuery.data ?? null
  const leaderboard  = leaderboardQuery.data ?? []
  const loading = !!wallet && (todayQuery.isLoading || totalQuery.isLoading || matchesQuery.isLoading || leaderboardQuery.isLoading)

  useEffect(() => {
    if (todayQuery.data) setTodayPoints(todayQuery.data)
  }, [todayQuery.data])

  useEffect(() => {
    if (!leaderboardQuery.data || !wallet) return
    setMyLeaderboard(leaderboardQuery.data.find(r => r.walletAddress === wallet) ?? null)
  }, [leaderboardQuery.data, wallet])

  useEffect(() => {
    for (const q of [todayQuery, totalQuery, matchesQuery, leaderboardQuery]) {
      if (q.error) console.error('[home] failed to load dashboard data', q.error)
    }
  }, [todayQuery.error, totalQuery.error, matchesQuery.error, leaderboardQuery.error])

  useEffect(() => {
    if (!accountId) return
    const wallet = accountId

    const unsub = scoresApi.subscribeToLive({
      onMatchScores: (scores) => {
        setLiveMap((prev) => {
          const next = { ...prev }
          for (const s of scores) next[s.fixtureId] = s
          return next
        })
      },
      onMatchScore: (s) => setLiveMap((prev) => ({ ...prev, [s.fixtureId]: s })),
      onLeaderboard: (rows) => {
        const myRow = rows.find(r => r.walletAddress === wallet)
        if (!myRow) return
        setMyLeaderboard(myRow)
        // Extract per-player today points directly from live leaderboard data
        const live: Record<string, number> = {}
        for (const p of myRow.players) live[p.playerId] = p.points
        setTodayPoints(live)
      },
    })

    return unsub
  }, [accountId])

  const players = [squad.gk, squad.def1, squad.def2, squad.fwd1, squad.fwd2].filter(Boolean) as NonNullable<typeof squad.gk>[]
  const todayPts  = players.reduce((sum, p) => sum + (todayPoints[p.id] ?? 0), 0)
  const totalPts  = players.reduce((sum, p) => sum + (totalPoints[p.id] ?? 0), 0) || (myLeaderboard?.totalPoints ?? 0)
  const totalGoals = players.reduce((sum, p) => sum + (p.goals ?? 0), 0)
  const totalCaps  = players.reduce((sum, p) => sum + (p.caps ?? 0), 0)
  const squadFilled = filledCount(squad)
  const squadComplete = isComplete(squad)
  // Live first, then whatever's coming up next (today, then future), and
  // finished results filling out the rest of the card.
  const todayFixtures = [
    ...(matches?.live ?? []),
    ...(matches?.today ?? []),
    ...(matches?.upcoming ?? []),
    ...(matches?.finished ?? []),
  ].slice(0, 6)
  const liveCount = (matches?.live ?? []).length + Object.values(liveMap).filter(s => s.matchStatus === 'live').length
  const finishedCount = matches?.finished?.length ?? 0

  const sortedLeaderboard = [...leaderboard].sort((a, b) => a.rank - b.rank)
  const topLeaderboard = sortedLeaderboard.slice(0, 5)
  const myRowInTop = !!wallet && topLeaderboard.some(r => r.walletAddress === wallet)

  return (
    <div className="h-full overflow-y-auto pt-7 px-7 pb-10 bg-bg max-[640px]:py-4 max-[640px]:px-4 max-[640px]:pb-8">

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-start justify-between flex-wrap gap-3 mb-6"
      >
        <div>
          <p className="text-white/70 text-[11px] font-bold uppercase tracking-[0.18em] mb-1.5">{today}</p>
          <h1 className="text-white text-2xl font-black tracking-[-0.01em] leading-none">
            {squadName ? squadName : 'Dashboard'}
            {displayLabel && <span className="text-white/70 font-normal text-sm ml-3 tracking-normal">{displayLabel}</span>}
          </h1>
        </div>
        {liveCount > 0 && (
          <div className="flex items-center gap-1.5 bg-accent/10 border border-accent/25 rounded-full py-1.5 px-3.5">
            <Radio size={11} className="text-accent" />
            <span className="text-accent text-[11px] font-black uppercase tracking-widest">{liveCount} Live Now</span>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-4 max-[900px]:grid-cols-2 gap-3.5 mb-5">
        {[
          <StatCard key="today" icon={Zap} label="Today" value={loading ? '—' : String(todayPts)} sub="pts today" accent />,
          <StatCard key="total" icon={Trophy} label="Total" value={loading ? '—' : String(totalPts)} sub="pts all-time" />,
          <StatCard key="rank" icon={TrendingUp} label="Rank" value={myLeaderboard ? `#${myLeaderboard.rank}` : '—'} sub={`of ${sortedLeaderboard.length || '—'}`} />,
          <StatCard key="squad" icon={Users} label="Squad" value={`${squadFilled}/5`} sub={squadComplete ? 'Complete' : 'Incomplete'} />,
        ].map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
          >
            {card}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-[1.3fr_1fr] max-[900px]:grid-cols-1 gap-4.5">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white/2 border border-white/7 rounded-2xl p-5.5"
        >
          <div className="flex items-center justify-between mb-4.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                <Shirt size={14} className="text-accent" />
              </div>
              <div>
                <p className="text-white/70 text-[9.5px] font-extrabold uppercase tracking-[0.2em] mb-0.75">My Squad</p>
                <p className="text-white text-[15px] font-extrabold">{squadName || 'Unnamed Squad'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              {squadComplete && <span className="bg-accent/10 border border-accent/20 text-accent text-[10px] font-extrabold py-1 px-2.5 rounded-full uppercase tracking-widest">Complete</span>}
              {squadFilled > 0 && (
                <Link href="/my-squad" className="text-white/70 hover:text-white text-[11px] font-bold flex items-center gap-1 no-underline">
                  View <ArrowRight size={12} />
                </Link>
              )}
            </div>
          </div>

          {players.length === 0 ? (
            <div className="flex flex-col items-center text-center py-12 px-6">
              <div className="w-13 h-13 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                <Shirt size={22} className="text-accent" />
              </div>
              <p className="text-white font-bold text-[15px] mb-1.5">No squad built yet</p>
              <p className="text-white/70 text-[12.5px] mb-5 max-w-70">Pick a goalkeeper, two defenders and two forwards to enter the competition.</p>
              <Link
                href="/squad"
                className="bg-accent hover:bg-accent-hover text-bg py-2.5 px-6 rounded-lg font-black text-xs uppercase tracking-widest no-underline transition-colors"
              >
                Build Your Squad
              </Link>
            </div>
          ) : (
            <>
              <div className="h-95 max-[640px]:h-80">
                <Pitch squad={squad} selectedSlot={null} onSlotClick={() => {}} points={todayPoints} readOnly />
              </div>

              {!squadComplete && (
                <div className="flex items-center justify-between mt-3.5 py-2.5 px-3.5 rounded-[10px] bg-white/3 border border-white/7">
                  <span className="text-white/70 text-[11.5px] font-medium">Your squad still has {5 - squadFilled} open {5 - squadFilled === 1 ? 'slot' : 'slots'}</span>
                  <Link href="/squad" className="text-accent text-[11px] font-bold no-underline shrink-0">Finish squad →</Link>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mt-3.5">
                <div className="flex items-center justify-between py-2.5 px-3 rounded-[10px] bg-white/4 border border-white/8">
                  <span className="text-white/70 text-[10.5px] font-extrabold uppercase tracking-widest">Goals</span>
                  <span className="text-white text-lg font-black">{totalGoals}</span>
                </div>
                <div className="flex items-center justify-between py-2.5 px-3 rounded-[10px] bg-white/4 border border-white/8">
                  <span className="text-white/70 text-[10.5px] font-extrabold uppercase tracking-widest">Caps</span>
                  <span className="text-white text-lg font-black">{totalCaps}</span>
                </div>
              </div>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          className="flex flex-col gap-4.5"
        >

          <div className="bg-white/2 border border-white/7 rounded-2xl p-5.5">
            <div className="flex items-center justify-between mb-4.5">
              <p className="text-white/70 text-[9.5px] font-extrabold uppercase tracking-[0.2em]">Matches</p>
              <div className="flex items-center gap-3">
                {(liveCount > 0 || finishedCount > 0) && (
                  <div className="flex items-center gap-1.5 text-white/70 text-[10px] font-bold">
                    {liveCount > 0 && <span className="text-accent">{liveCount} live</span>}
                    {liveCount > 0 && finishedCount > 0 && <span>·</span>}
                    {finishedCount > 0 && <span>{finishedCount} finished</span>}
                  </div>
                )}
                <Link href="/fixtures" className="text-white/70 hover:text-white text-[11px] font-bold flex items-center gap-1 no-underline shrink-0">
                  View all <ArrowRight size={12} />
                </Link>
              </div>
            </div>
            {loading ? (
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map(i => <div key={i} className="h-13 rounded-[10px] bg-white/3" />)}
              </div>
            ) : todayFixtures.length === 0 ? (
              <p className="text-white/70 text-[13px] text-center py-6">Check back on match days</p>
            ) : (
              <div className="flex flex-col gap-2">
                {todayFixtures.map((fixture) => {
                  const live = liveMap[fixture.fixtureId]
                  const isLiveNow = fixture.status === 'live' || live?.matchStatus === 'live'
                  const h = live?.homeScore ?? fixture.homeScore
                  const a = live?.awayScore ?? fixture.awayScore
                  const min = live?.minute ?? fixture.minute
                  const hasScore = h !== null && a !== null
                  // Some fixtures come back from the API still flagged "upcoming"
                  // even once a final score exists — trust the score over the
                  // stale status field so finished matches don't show as "Soon".
                  const displayStatus: 'live' | 'finished' | 'upcoming' =
                    isLiveNow ? 'live' : fixture.status === 'finished' || hasScore ? 'finished' : 'upcoming'
                  return (
                    <div key={fixture.fixtureId} className={`py-2.5 px-3 rounded-[10px] border ${isLiveNow ? 'bg-accent/4 border-accent/15' : 'bg-white/3 border-white/5'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white/70 text-[9px] font-bold uppercase tracking-[0.12em]">{fixture.round}</span>
                        <div className="flex items-center gap-1.5">
                          {isLiveNow && min != null && <span className="text-accent text-[9px] font-bold">{min}&apos;</span>}
                          {displayStatus === 'upcoming' && (
                            <span className="text-white/70 text-[9px] font-bold">{fmtKickoff(fixture.startTime)}</span>
                          )}
                          <MatchBadge status={displayStatus} />
                        </div>
                      </div>
                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <FlagImg country={resolveTeam(fixture.homeTeam)} size={16} shape="rect" />
                          <span className="text-white text-xs font-bold truncate">{fixture.homeTeam}</span>
                        </div>
                        <span className={`text-xs font-black text-center shrink-0 min-w-12 ${isLiveNow ? 'text-accent' : 'text-white/70'}`}>
                          {hasScore ? `${h} – ${a}` : 'vs'}
                        </span>
                        <div className="flex items-center justify-end gap-1.5 min-w-0">
                          <span className="text-white text-xs font-bold text-right truncate">{fixture.awayTeam}</span>
                          <FlagImg country={resolveTeam(fixture.awayTeam)} size={16} shape="rect" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="bg-white/2 border border-white/7 rounded-2xl p-5.5">
            <div className="flex items-center justify-between mb-4.5">
              <p className="text-white/70 text-[9.5px] font-extrabold uppercase tracking-[0.2em]">Leaderboard</p>
              <Link href="/tournaments" className="text-white/70 hover:text-white text-[11px] font-bold flex items-center gap-1 no-underline">
                Full <ArrowRight size={12} />
              </Link>
            </div>
            {leaderboardQuery.isLoading ? (
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map(i => <div key={i} className="h-9.5 rounded-[10px] bg-white/3" />)}
              </div>
            ) : topLeaderboard.length === 0 ? (
              <p className="text-white/70 text-[13px] text-center py-6">No entries yet</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {topLeaderboard.map((row) => {
                  const mine = row.walletAddress === wallet
                  return (
                    <div key={row.walletAddress} className={`flex items-center gap-2.5 py-2 px-3 rounded-[10px] border ${mine ? 'bg-accent/6 border-accent/20' : 'bg-white/3 border-white/5'}`}>
                      <span className={`w-5 shrink-0 text-[11px] font-black text-center ${row.rank <= 3 ? 'text-accent' : 'text-white/70'}`}>{row.rank}</span>
                      <span className={`flex-1 min-w-0 text-[12.5px] font-bold overflow-hidden text-ellipsis whitespace-nowrap ${mine ? 'text-accent' : 'text-white'}`}>{row.squadName || 'Unnamed Squad'}</span>
                      <span className="text-white text-[12.5px] font-black shrink-0">{row.totalPoints}</span>
                    </div>
                  )
                })}
                {myLeaderboard && !myRowInTop && (
                  <div className="flex items-center gap-2.5 py-2 px-3 rounded-[10px] border bg-accent/6 border-accent/20 mt-0.5">
                    <span className="w-5 shrink-0 text-[11px] font-black text-center text-accent">{myLeaderboard.rank}</span>
                    <span className="flex-1 min-w-0 text-[12.5px] font-bold overflow-hidden text-ellipsis whitespace-nowrap text-accent">{myLeaderboard.squadName || 'Unnamed Squad'}</span>
                    <span className="text-white text-[12.5px] font-black shrink-0">{myLeaderboard.totalPoints}</span>
                  </div>
                )}
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </div>
  )
}
