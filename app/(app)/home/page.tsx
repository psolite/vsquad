'use client'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAccountId } from '@/lib/useAccountId'
import { useSquadStore, filledCount, isComplete } from '@/store/squadStore'
import { scoresApi } from '@/lib/api/scoresApi'
import type { SquadLiveScore, MatchLiveScore } from '@/lib/api/scoresApi'

const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

function PositionBadge({ pos }: { pos: string }) {
  const colors: Record<string, [string, string]> = { GK: ['#f59e0b', 'rgba(245,158,11,0.12)'], DEF: ['#3b82f6', 'rgba(59,130,246,0.12)'], FWD: ['#00FF87', 'rgba(0,255,135,0.12)'] }
  const [color, bg] = colors[pos] ?? ['#fff', 'rgba(255,255,255,0.1)']
  return <span className="text-[9px] font-extrabold uppercase tracking-widest py-0.5 px-1.75 rounded" style={{ background: bg, border: `1px solid ${color}33`, color }}>{pos}</span>
}

function MatchBadge({ status }: { status: 'upcoming' | 'live' | 'finished' }) {
  if (status === 'live') return <span className="flex items-center gap-1 text-accent text-[10px] font-extrabold"><span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_#00FF87] inline-block" />LIVE</span>
  if (status === 'finished') return <span className="text-white/70 text-[10px] font-bold">FT</span>
  return <span className="text-white/70 text-[10px] font-bold">Soon</span>
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
  const squadFilled = filledCount(squad)
  const squadComplete = isComplete(squad)
  const todayFixtures = [...(matches?.live ?? []), ...(matches?.today ?? []), ...(matches?.finished ?? [])].slice(0, 6)
  const liveCount = (matches?.live ?? []).length + Object.values(liveMap).filter(s => s.matchStatus === 'live').length

  return (
    <div className="h-full overflow-y-auto pt-7 px-7 pb-10 bg-bg max-[640px]:py-4 max-[640px]:px-4 max-[640px]:pb-8">

      <div className="mb-5.5">
        <p className="text-white/70 text-[11px] font-bold uppercase tracking-[0.18em] mb-1.5">{today}</p>
        <h1 className="text-white text-2xl font-black tracking-[-0.01em] leading-none">
          Dashboard
          {displayLabel && <span className="text-white/70 font-normal text-sm ml-3 tracking-normal">{displayLabel}</span>}
        </h1>
      </div>

      <div className="grid grid-cols-2 max-[700px]:grid-cols-1 gap-3.5 mb-4.5">
        <div className="bg-[linear-gradient(135deg,rgba(0,255,135,0.1)_0%,rgba(0,255,135,0.04)_100%)] border border-accent/25 rounded-[18px] py-6.5 px-7">
          <p className="text-accent/60 text-[10px] font-extrabold uppercase tracking-[0.22em] mb-3">Today&apos;s Points</p>
          <div className="flex items-end gap-2 leading-none">
            <span className="text-accent text-6xl font-black leading-none tracking-[-0.02em]">{loading ? '—' : todayPts}</span>
            <span className="text-accent/40 text-base font-bold mb-1.75">pts</span>
          </div>
          <p className="text-white/70 text-[11px] font-medium mt-2.5">Earned from today&apos;s matches</p>
        </div>

        <div className="bg-white/3 border border-white/10 rounded-[18px] py-6.5 px-7">
          <p className="text-white/70 text-[10px] font-extrabold uppercase tracking-[0.22em] mb-3">Total Points</p>
          <div className="flex items-end gap-2 leading-none">
            <span className="text-white text-6xl font-black leading-none tracking-[-0.02em]">{loading ? '—' : totalPts}</span>
            <span className="text-white/70 text-base font-bold mb-1.75">pts</span>
          </div>
          <p className="text-white/70 text-[11px] font-medium mt-2.5">{myLeaderboard ? `Rank #${myLeaderboard.rank} · All time` : 'All time cumulative'}</p>
        </div>
      </div>

      <div className="flex flex-nowrap max-[560px]:flex-wrap gap-3 mb-4.5">
        {[{ label: 'Squad', value: `${squadFilled}/5` }, { label: 'Live', value: loading ? '—' : String(liveCount > 0 ? liveCount : (matches?.live?.length ?? 0)) }, { label: "Today's Matches", value: loading ? '—' : String(matches?.today?.length ?? 0) }, { label: 'Finished', value: loading ? '—' : String(matches?.finished?.length ?? 0) }].map(({ label, value }) => (
          <div key={label} className="flex-1 max-[560px]:flex-[1_1_calc(50%-6px)] max-[560px]:min-w-0 bg-white/3 border border-white/7 rounded-xl py-3.5 px-4">
            <p className="text-white/70 text-[9px] font-extrabold uppercase tracking-[0.16em] mb-1.25">{label}</p>
            <p className="text-white text-xl font-black leading-none">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 max-[700px]:grid-cols-1 gap-4.5">
        <div className="bg-white/2 border border-white/7 rounded-2xl p-5.5">
          <div className="flex items-center justify-between mb-4.5">
            <div>
              <p className="text-white/70 text-[9.5px] font-extrabold uppercase tracking-[0.2em] mb-0.75">My Squad</p>
              <p className="text-white text-[15px] font-extrabold">{squadName || 'Unnamed Squad'}</p>
            </div>
            {squadComplete && <span className="bg-accent/10 border border-accent/20 text-accent text-[10px] font-extrabold py-1 px-2.5 rounded-full uppercase tracking-widest">Complete</span>}
          </div>

          {players.length === 0 ? (
            <div className="text-center py-7.5">
              <p className="text-white/70 text-[13px] mb-1.5">No squad built yet</p>
              <a href="/squad" className="text-accent text-xs font-bold no-underline">Build your squad →</a>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {players.map((player) => {
                const todayPt = todayPoints[player.id] ?? 0
                const totalPt = totalPoints[player.id] ?? 0
                return (
                  <div key={player.id} className="flex items-center gap-3 py-2.5 px-3 rounded-[10px] bg-white/3 border border-white/5">
                    <PositionBadge pos={player.position} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-[13px] font-bold whitespace-nowrap overflow-hidden text-ellipsis">{player.name}</p>
                      <p className="text-white/70 text-[11px] font-medium">{player.country}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-base font-black leading-none ${loading ? 'text-white/70' : todayPt > 0 ? 'text-accent' : 'text-white'}`}>{loading ? '—' : todayPt}</p>
                      <p className="text-white/70 text-[9px] font-bold uppercase tracking-widest">today · {totalPt} total</p>
                    </div>
                  </div>
                )
              })}
              <div className="flex gap-2 mt-1">
                <div className="flex-1 flex items-center justify-between py-2.5 px-3 rounded-[10px] bg-accent/5 border border-accent/15">
                  <span className="text-accent text-[11px] font-extrabold uppercase tracking-widest">Today</span>
                  <span className="text-accent text-lg font-black">{loading ? '—' : todayPts}</span>
                </div>
                <div className="flex-1 flex items-center justify-between py-2.5 px-3 rounded-[10px] bg-white/4 border border-white/8">
                  <span className="text-white/70 text-[11px] font-extrabold uppercase tracking-widest">Total</span>
                  <span className="text-white text-lg font-black">{loading ? '—' : totalPts}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/2 border border-white/7 rounded-2xl p-5.5">
          <p className="text-white/70 text-[9.5px] font-extrabold uppercase tracking-[0.2em] mb-0.75">Today&apos;s Matches</p>
          <p className="text-white text-[15px] font-extrabold mb-4.5">
            {loading ? '—' : todayFixtures.length === 0 ? 'No matches today' : `${todayFixtures.length} fixture${todayFixtures.length !== 1 ? 's' : ''}`}
          </p>
          {loading ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map(i => <div key={i} className="h-13 rounded-[10px] bg-white/3" />)}
            </div>
          ) : todayFixtures.length === 0 ? (
            <p className="text-white/70 text-[13px] text-center pt-7.5">Check back on match days</p>
          ) : (
            <div className="flex flex-col gap-2">
              {todayFixtures.map((fixture) => {
                const live = liveMap[fixture.fixtureId]
                const isLiveNow = fixture.status === 'live' || live?.matchStatus === 'live'
                const h = live?.homeScore ?? fixture.homeScore
                const a = live?.awayScore ?? fixture.awayScore
                const min = live?.minute ?? fixture.minute
                return (
                  <div key={fixture.fixtureId} className={`py-2.5 px-3 rounded-[10px] border ${isLiveNow ? 'bg-accent/4 border-accent/15' : 'bg-white/3 border-white/5'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white/70 text-[9px] font-bold uppercase tracking-[0.12em]">{fixture.round}</span>
                      <div className="flex items-center gap-1.5">
                        {isLiveNow && min != null && <span className="text-accent text-[9px] font-bold">{min}&apos;</span>}
                        <MatchBadge status={isLiveNow ? 'live' : fixture.status} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs font-bold">{fixture.homeTeam}</span>
                      <span className={`text-xs font-black px-2.5 ${isLiveNow ? 'text-accent' : 'text-white/70'}`}>
                        {h !== null && a !== null ? `${h} – ${a}` : 'vs'}
                      </span>
                      <span className="text-white text-xs font-bold text-right">{fixture.awayTeam}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
