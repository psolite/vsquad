'use client'
import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAccountId } from '@/lib/useAccountId'
import { useSquadStore, isComplete } from '@/store/squadStore'
import { tournamentApi } from '@/lib/api/tournamentApi'
import type { Tournament, CreateTournamentInput } from '@/lib/api/tournamentApi'
import { scoresApi } from '@/lib/api/scoresApi'
import type { SquadLiveScore, GoalEvent, Fixture, MatchLiveScore } from '@/lib/api/scoresApi'
import FlagImg from '@/components/FlagImg'
import { countryColors } from '@/data/countryColors'
import Spinner, { LoadingState } from '@/components/Spinner'

const STATUS_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  open:   { label: 'Open',  bg: 'rgba(0,255,135,0.12)',   color: '#00FF87' },
  active: { label: 'Live',  bg: 'rgba(250,204,21,0.12)',  color: '#facc15' },
  ended:  { label: 'Ended', bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' },
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
function shortWallet(addr: string) { return `${addr.slice(0, 4)}…${addr.slice(-4)}` }
function fmtTime(ms: number) {
  return new Date(ms).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}
function fmtDate(ms: number) {
  const d = new Date(ms)
  const today = new Date()
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)
  if (d.toDateString() === today.toDateString())    return 'Today'
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

const EMPTY_FORM: CreateTournamentInput = {
  name: '', description: '', prize: '', status: 'open',
  startDate: '', endDate: '', maxParticipants: 500,
}

function InputRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.25">
      <label className="text-white/70 text-[10px] font-bold uppercase tracking-widest">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClass = 'w-full box-border bg-white/5 border border-white/10 focus:border-accent/40 rounded-lg py-2.25 px-3 text-white text-[13px] outline-none transition-colors'

function GoalToast({ event, onDone }: { event: GoalEvent; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-1000 bg-yellow-400 text-bg rounded-xl py-3 px-5 flex items-center gap-2.5 shadow-[0_8px_32px_rgba(250,204,21,0.4)]">
      <span className="text-xl">⚽</span>
      <div>
        <div className="font-black text-[13px] uppercase tracking-[0.08em]">GOAL! {event.playerName}</div>
        <div className="text-[11px] opacity-75">{event.teamName} · {event.score} · {event.minute}&apos;</div>
      </div>
      <button onClick={onDone} className="ml-1 bg-black/15 border-none rounded-full w-5 h-5 cursor-pointer text-bg text-[11px] flex items-center justify-center">✕</button>
    </div>
  )
}

function LeaderboardPanel({ wallet }: { wallet: string }) {
  const leaderboardQuery = useQuery({ queryKey: ['leaderboard'], queryFn: scoresApi.leaderboard })
  const [rows,  setRows]  = useState<SquadLiveScore[]>([])
  const [toast, setToast] = useState<GoalEvent | null>(null)
  const [live,  setLive]  = useState(false)
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (leaderboardQuery.data) setRows(leaderboardQuery.data)
  }, [leaderboardQuery.data])

  useEffect(() => {
    if (leaderboardQuery.error) console.error('[tournaments] failed to load leaderboard', leaderboardQuery.error)
  }, [leaderboardQuery.error])

  useEffect(() => {
    cleanupRef.current = scoresApi.subscribeToLive({
      onLeaderboard: (data) => { setRows(data); setLive(true) },
      onGoal: (e) => setToast(e),
    })
    return () => cleanupRef.current?.()
  }, [])

  if (leaderboardQuery.isLoading) return <LoadingState label="Loading leaderboard…" />
  if (rows.length === 0) return <div className="text-center mt-15"><p className="text-white/70 text-[13px]">No squads yet — be the first to join a tournament!</p></div>

  return (
    <>
      {toast && <GoalToast event={toast} onDone={() => setToast(null)} />}
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-1.75 h-1.75 rounded-full ${live ? 'bg-accent shadow-[0_0_6px_#00FF87]' : 'bg-yellow-400'}`} />
        <span className={`text-[11px] font-bold ${live ? 'text-accent' : 'text-white/70'}`}>{live ? 'Live' : 'Last snapshot'} — {rows.length} squads</span>
      </div>
      <div className="flex flex-col gap-2">
        {rows.map((row) => {
          const isMe = row.walletAddress === wallet
          const topScorer = row.players.reduce((a, b) => b.points > a.points ? b : a, row.players[0])
          return (
            <div key={row.walletAddress} className={`rounded-[14px] py-3.5 px-4.5 border ${isMe ? 'bg-accent/5 border-accent/20' : 'bg-white/3 border-white/7'}`}>
              <div className="flex items-center gap-3 mb-2.5">
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-black ${row.rank === 1 ? 'bg-yellow-400' : row.rank === 2 ? 'bg-white/15' : row.rank === 3 ? 'bg-[rgba(205,127,50,0.4)]' : 'bg-white/6'} ${row.rank <= 2 ? 'text-bg' : 'text-white'}`}>
                  {row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : `#${row.rank}`}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-black text-sm ${isMe ? 'text-accent' : 'text-white'}`}>{row.squadName}</span>
                    {isMe && <span className="bg-accent/12 text-accent text-[9px] font-black uppercase tracking-widest py-px px-1.5 rounded-sm">You</span>}
                  </div>
                  <span className="text-white/70 text-[10px] font-mono">{shortWallet(row.walletAddress)}</span>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-[22px] font-black leading-none ${isMe ? 'text-accent' : 'text-white'}`}>{row.totalPoints}</div>
                  <div className="text-white/70 text-[10px] uppercase tracking-wider">pts</div>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {row.players.map((p) => (
                  <div key={p.playerId} className={`rounded-lg py-1.25 px-2.25 min-w-15 ${p.points > 0 ? 'bg-accent/8' : 'bg-white/4'}`}>
                    <div className={`text-[10px] font-bold ${p.points > 0 ? 'text-accent' : 'text-white/70'}`}>{p.name.split(' ').pop()}</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-white/70 text-[9px] uppercase">{p.position}</span>
                      {p.goals > 0 && <span className="text-[9px]">⚽{p.goals}</span>}
                      {p.assists > 0 && <span className="text-[9px] text-blue-400">A{p.assists}</span>}
                      {p.yellowCards > 0 && <span className="text-[9px]">🟨</span>}
                      {p.redCards > 0 && <span className="text-[9px]">🟥</span>}
                      <span className={`text-[10px] font-bold ml-0.5 ${p.points > 0 ? 'text-accent' : 'text-white/70'}`}>{p.points > 0 ? `+${p.points}` : '0'}</span>
                    </div>
                  </div>
                ))}
              </div>
              {topScorer && topScorer.points > 0 && (
                <div className="mt-2 text-white/70 text-[10px]">
                  Top scorer: <span className="text-yellow-400 font-bold">{topScorer.name}</span> · {topScorer.points} pts
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

const TEAM_NAME_MAP: Record<string, string> = {
  'United States':          'USA', 'US': 'USA',
  'Korea Republic':         'South Korea', 'Republic of Korea': 'South Korea',
  'IR Iran':                'Iran',
  "Côte d'Ivoire":          'Ivory Coast', "Cote d'Ivoire": 'Ivory Coast',
  'DR Congo':               'Congo DR', 'Democratic Republic of the Congo': 'Congo DR',
  'Czechia':                'Czech Republic',
  'Bosnia-Herzegovina':     'Bosnia & Herzegovina', 'Bosnia and Herzegovina': 'Bosnia & Herzegovina',
  'China PR':               'China',
}

function resolveTeam(name: string): string {
  if (!name) return name
  if (TEAM_NAME_MAP[name]) return TEAM_NAME_MAP[name]
  if (countryColors[name])  return name
  const lower = name.toLowerCase()
  const key = Object.keys(countryColors).find(k => k.toLowerCase() === lower)
  return key ?? name
}

function teamCode(name: string): string {
  const resolved = resolveTeam(name)
  return countryColors[resolved]?.code ?? name.slice(0, 3).toUpperCase()
}

function stageLabel(competition: string, round: string): string {
  const r = (round ?? '').toUpperCase()
  if (r.includes('FINAL') || r.includes('OF') || r.includes('SEMI') || r.includes('QUARTER')) return 'KO STAGE'
  if (r.includes('GROUP')) return 'GROUP STAGE'
  const c = (competition ?? '').toUpperCase()
  if (c.includes('WORLD CUP')) return 'WORLD CUP'
  return competition || 'MATCH'
}

function MatchCard({ f, liveOverride }: { f: Fixture; liveOverride?: { homeScore: number; awayScore: number; minute: number } }) {
  const isLive     = f.status === 'live' || !!liveOverride
  const isFinished = f.status === 'finished' && !liveOverride
  const homeScore  = liveOverride?.homeScore ?? f.homeScore
  const awayScore  = liveOverride?.awayScore ?? f.awayScore
  const minute     = liveOverride?.minute ?? f.minute
  const hasScore   = homeScore != null && awayScore != null

  const stage    = stageLabel(f.competition, f.round)
  const roundLbl = f.round ? f.round.toUpperCase() : ''

  const PERIOD_LABEL: Record<string, string> = {
    H1: '1st Half', '2': '1st Half',
    HT: 'Half Time', '3': 'Half Time',
    H2: '2nd Half', '4': '2nd Half',
    ET1: 'ET', ET2: 'ET', HTET: 'ET HT', '5': 'ET', '6': 'ET HT', '7': 'ET',
    PE: 'Penalties', '8': 'Penalties',
    F: 'FT', '9': 'FT', FET: 'FT (AET)', '10': 'FT (AET)', FPE: 'FT (Pens)', '11': 'FT (Pens)',
  }
  const rawLabel    = f.statusCode ? PERIOD_LABEL[f.statusCode] : null
  const periodLabel = rawLabel ?? (isFinished ? 'FT' : null)

  return (
    <div className={`rounded-[14px] overflow-hidden border ${isLive ? 'bg-yellow-400/4 border-yellow-400/25' : 'bg-[#0d1320] border-white/8'}`}>
      <div className="flex items-center justify-between py-1.75 px-3.5 border-b border-white/5 bg-white/2">
        <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest">
          {stage}
          {!isLive && !isFinished && <> · <span className="text-white/70">{fmtTime(f.startTime)}</span></>}
          {isLive && minute != null && <> · <span className="text-yellow-400">{minute}&apos;</span></>}
          {isFinished && <> · <span className="text-white/70">FT</span></>}
        </span>
        <div className="flex items-center gap-2">
          {isLive && (
            <div className="flex items-center gap-1">
              <div className="w-1.25 h-1.25 rounded-full bg-yellow-400 shadow-[0_0_5px_#facc15]" />
              <span className="text-yellow-400 text-[9px] font-black uppercase tracking-widest">Live</span>
            </div>
          )}
          {roundLbl && <span className="text-white/70 text-[10px] font-bold uppercase tracking-[0.08em]">{roundLbl}</span>}
        </div>
      </div>

      <div className="flex items-center py-4 px-5 gap-2">
        <div className="flex-1 flex flex-col items-center gap-1.75">
          <FlagImg country={resolveTeam(f.homeTeam)} size={32} shape="rect" />
          <span className="text-white font-extrabold text-[13px] text-center">{f.homeTeam}</span>
          <span className="text-white/70 text-[10px] font-bold tracking-widest">{teamCode(f.homeTeam)}</span>
        </div>

        <div className="shrink-0 text-center min-w-22.5">
          {hasScore ? (
            <div>
              <div className="flex items-center justify-center gap-1.5">
                <span className={`font-black text-[28px] leading-none ${isLive ? 'text-yellow-400' : 'text-white'}`}>{homeScore}</span>
                <span className="text-white/70 font-light text-xl">–</span>
                <span className={`font-black text-[28px] leading-none ${isLive ? 'text-yellow-400' : 'text-white'}`}>{awayScore}</span>
              </div>
              {isLive && <div className="text-yellow-400 text-[10px] font-bold mt-0.75">{periodLabel ?? (minute != null ? `${minute}'` : 'Live')}</div>}
              {isFinished && <div className="text-white/70 text-[9px] uppercase tracking-[0.08em] mt-0.75">{periodLabel ?? 'FT'}</div>}
            </div>
          ) : isLive ? (
            <div>
              <div className="flex items-center justify-center gap-1">
                <div className="w-1.25 h-1.25 rounded-full bg-yellow-400 shadow-[0_0_5px_#facc15]" />
                <span className="text-yellow-400 font-black text-xs tracking-widest">LIVE</span>
              </div>
              {minute != null && <div className="text-yellow-400 text-[10px] mt-0.75">{minute}&apos;</div>}
            </div>
          ) : isFinished ? (
            <div>
              <div className="text-white/70 font-bold text-sm">{fmtTime(f.startTime)}</div>
              <div className="text-white/70 text-[9px] uppercase tracking-[0.08em] mt-0.75">Full Time</div>
            </div>
          ) : (
            <div>
              <span className="text-white/70 font-black text-[13px] tracking-[0.15em] uppercase">VS</span>
              <div className="text-white/70 text-[10px] mt-1">{fmtDate(f.startTime)}</div>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center gap-1.75">
          <FlagImg country={resolveTeam(f.awayTeam)} size={32} shape="rect" />
          <span className="text-white font-extrabold text-[13px] text-center">{f.awayTeam}</span>
          <span className="text-white/70 text-[10px] font-bold tracking-widest">{teamCode(f.awayTeam)}</span>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ label, count, color = 'rgba(255,255,255,0.7)' }: { label: string; count: number; color?: string }) {
  return (
    <div className="flex items-center gap-2 mt-3 mb-2">
      <span style={{ color }} className="text-[10px] font-black uppercase tracking-[0.12em]">{label}</span>
      <span className="bg-white/7 text-white/70 text-[10px] font-bold py-px px-1.75 rounded-[10px]">{count}</span>
      <div className="flex-1 h-px bg-white/6" />
    </div>
  )
}

export function FixturesPanel() {
  const matchesQuery = useQuery({
    queryKey: ['matches'],
    queryFn: scoresApi.matches,
    // Refresh every 2 min to pick up newly kicked-off matches
    refetchInterval: 2 * 60_000,
  })
  const data = matchesQuery.data ?? null
  const [liveMap, setLiveMap] = useState<Record<string, MatchLiveScore>>({})

  function applyScore(s: MatchLiveScore) {
    setLiveMap((prev) => ({ ...prev, [s.fixtureId]: s }))
  }

  useEffect(() => {
    if (matchesQuery.error) console.error('[tournaments] failed to load matches', matchesQuery.error)
  }, [matchesQuery.error])

  useEffect(() => {
    const cleanup = scoresApi.subscribeToLive({
      // Batch snapshot on connect (sends all currently known live scores)
      onMatchScores: (scores) => {
        setLiveMap((prev) => {
          const next = { ...prev }
          for (const s of scores) next[s.fixtureId] = s
          return next
        })
      },
      // Individual score update as each event fires
      onMatchScore: applyScore,
      onGoal: (e) => {
        const parts = (e.score ?? '').split(/[-:]/).map(Number)
        if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return
        setLiveMap((prev) => ({
          ...prev,
          [e.fixtureId]: {
            fixtureId: e.fixtureId,
            homeScore: parts[0], awayScore: parts[1],
            minute: e.minute, matchStatus: 'live',
          },
        }))
      },
    })

    return cleanup
  }, [])

  if (matchesQuery.isLoading) return <LoadingState label="Loading matches…" />
  if (matchesQuery.isError)   return <p className="text-red-400 text-[13px] text-center mt-15">Could not load matches — server may be starting up</p>
  if (!data)   return null

  const todayAll = [...(data.live ?? []), ...(data.today ?? [])]
  const total    = todayAll.length + data.finished.length + data.upcoming.length
  if (total === 0) return <p className="text-white/70 text-[13px] text-center mt-15">No matches found</p>

  return (
    <div className="flex flex-col gap-1">
      {todayAll.length > 0 && (
        <>
          <SectionHeader label="Today" count={todayAll.length} color="#facc15" />
          <div className="grid grid-cols-2 max-[560px]:grid-cols-1 gap-2">
            {data.live.map((f) => <MatchCard key={f.fixtureId} f={f} liveOverride={liveMap[f.fixtureId]} />)}
            {(data.today ?? []).map((f) => <MatchCard key={f.fixtureId} f={f} liveOverride={liveMap[f.fixtureId]} />)}
          </div>
        </>
      )}
      {data.upcoming.length > 0 && (
        <>
          <SectionHeader label="Upcoming" count={data.upcoming.length} color="#60a5fa" />
          <div className="grid grid-cols-2 max-[560px]:grid-cols-1 gap-2">{data.upcoming.map((f) => <MatchCard key={f.fixtureId} f={f} />)}</div>
        </>
      )}
      {data.finished.length > 0 && (
        <>
          <SectionHeader label="Results" count={data.finished.length} color="rgba(255,255,255,0.7)" />
          <div className="grid grid-cols-2 max-[560px]:grid-cols-1 gap-2">{data.finished.map((f) => <MatchCard key={f.fixtureId} f={f} />)}</div>
        </>
      )}
    </div>
  )
}

type Tab = 'tournaments' | 'leaderboard'

export default function TournamentPage() {
  const { id: accountId } = useAccountId()
  const { squad } = useSquadStore()
  const queryClient = useQueryClient()

  const [tab,         setTab]         = useState<Tab>('tournaments')
  const [showCreate,  setShowCreate]  = useState(false)
  const [form,        setForm]        = useState<CreateTournamentInput>(EMPTY_FORM)
  const [createError, setCreateError] = useState<string | null>(null)

  const wallet   = accountId ?? ''
  const connected = !!accountId
  const hasSquad = isComplete(squad)

  const tournamentsQuery = useQuery({ queryKey: ['tournaments'], queryFn: tournamentApi.list })
  const tournaments = tournamentsQuery.data ?? []
  const loading     = tournamentsQuery.isLoading
  const error       = tournamentsQuery.isError ? 'Could not load tournaments. Is the server running?' : null

  useEffect(() => {
    if (tournamentsQuery.error) console.error('[tournaments] failed to load tournaments', tournamentsQuery.error)
  }, [tournamentsQuery.error])

  const createMutation = useMutation({
    mutationFn: (input: CreateTournamentInput) => tournamentApi.create(input),
    onSuccess: (created) => {
      queryClient.setQueryData<Tournament[]>(['tournaments'], (prev) => [created, ...(prev ?? [])])
      setShowCreate(false)
      setForm(EMPTY_FORM)
      toast.success('Tournament created!')
    },
    onError: (err) => {
      console.error('[tournaments] failed to create tournament', err)
      setCreateError(err instanceof Error ? err.message : 'Failed to create')
    },
  })

  const joinMutation = useMutation({
    mutationFn: (id: string) => tournamentApi.join(id, wallet),
    onSuccess: (updated) => {
      queryClient.setQueryData<Tournament[]>(['tournaments'], (prev) => (prev ?? []).map((t) => (t.id === updated.id ? updated : t)))
      toast.success('Joined tournament!')
    },
    onError: (err) => {
      console.error('[tournaments] failed to join tournament', err)
      toast.error(err instanceof Error ? err.message : 'Failed to join')
    },
  })

  const leaveMutation = useMutation({
    mutationFn: (id: string) => tournamentApi.leave(id, wallet),
    onSuccess: (_res, id) => {
      queryClient.setQueryData<Tournament[]>(['tournaments'], (prev) =>
        (prev ?? []).map((t) => (t.id === id ? { ...t, participants: t.participants.filter((w) => w !== wallet) } : t))
      )
      toast.success('Left tournament')
    },
    onError: (err) => {
      console.error('[tournaments] failed to leave tournament', err)
      toast.error(err instanceof Error ? err.message : 'Failed to leave')
    },
  })

  const creating = createMutation.isPending
  const busy = joinMutation.isPending ? joinMutation.variables : leaveMutation.isPending ? leaveMutation.variables : null

  function field(key: keyof CreateTournamentInput, value: string | number) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleCreate() {
    if (!form.name.trim() || !form.startDate || !form.endDate) {
      setCreateError('Name, start date and end date are required.')
      return
    }
    setCreateError(null)
    createMutation.mutate(form)
  }

  function handleJoin(id: string) {
    if (!wallet) return
    joinMutation.mutate(id)
  }

  function handleLeave(id: string) {
    if (!wallet) return
    leaveMutation.mutate(id)
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'tournaments', label: 'Tournaments' },
    { id: 'leaderboard', label: 'Live Leaderboard' },
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-bg">

      <div className="flex items-center justify-between flex-wrap gap-2.5 py-3 px-6 border-b border-white/7 shrink-0 bg-white/2">
        <div>
          <h2 className="text-white font-black text-[13px] uppercase tracking-[0.12em] m-0">VSquad Hub</h2>
          <p className="text-white/70 text-[11px] mt-0.5 tracking-wider">FIFA World Cup 2026 · Live scores &amp; leaderboard</p>
        </div>
        {tab === 'tournaments' && connected && (
          <button
            onClick={() => setShowCreate(true)}
            className="py-1.75 px-3.5 rounded-lg border-none bg-accent hover:bg-accent-hover text-bg text-[11px] font-black uppercase tracking-[0.08em] cursor-pointer transition-colors"
          >
            + Create
          </button>
        )}
      </div>

      <div className="flex gap-0.5 pt-2.5 px-6 pb-0 border-b border-white/7 shrink-0 bg-white/1">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`py-1.75 px-3.5 rounded-t-lg border-none text-[11px] uppercase tracking-[0.08em] cursor-pointer border-b-2 transition-all duration-150 ${tab === t.id ? 'bg-accent/10 text-accent font-black border-accent' : 'bg-transparent text-white/70 font-semibold border-transparent'}`}
          >
            {t.label}
            {t.id === 'leaderboard' && (
              <span className="ml-1.25 inline-block w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_4px_#00FF87] align-middle" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto min-h-0 py-5 px-6 min-w-0">

          {tab === 'tournaments' && (
            <>
              {!connected && (
                <div className="bg-yellow-400/6 border border-yellow-400/15 rounded-[10px] py-3 px-4 mb-4 flex items-center gap-2.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <p className="text-yellow-400 text-xs font-semibold m-0">Sign in to join or create a tournament</p>
                </div>
              )}
              {connected && !hasSquad && (
                <div className="bg-blue-400/6 border border-blue-400/15 rounded-[10px] py-3 px-4 mb-4 flex items-center gap-2.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <p className="text-blue-400 text-xs font-semibold m-0">Build and save your squad first to join tournaments</p>
                </div>
              )}

              {loading && <LoadingState label="Loading tournaments…" />}
              {error   && <p className="text-red-400 text-[13px] text-center mt-15">{error}</p>}

              {!loading && !error && (
                <div className="flex flex-col gap-2.5">
                  {tournaments.map((t) => {
                    const isJoined    = wallet ? t.participants.includes(wallet) : false
                    const isBusy      = busy === t.id
                    const statusStyle = STATUS_STYLE[t.status] ?? STATUS_STYLE.open
                    const pct         = Math.round((t.participants.length / t.maxParticipants) * 100)
                    const canAct      = connected && hasSquad && t.status !== 'ended'

                    return (
                      <div key={t.id} className={`rounded-[14px] py-4.5 px-5 border ${isJoined ? 'bg-accent/4 border-accent/18' : 'bg-white/3 border-white/7'}`}>
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <span style={{ background: statusStyle.bg, color: statusStyle.color }} className="text-[10px] font-black uppercase tracking-widest py-0.5 px-2 rounded-[5px]">{statusStyle.label}</span>
                              {isJoined && <span className="bg-accent/12 text-accent text-[10px] font-black uppercase tracking-[0.08em] py-0.5 px-2 rounded-[5px]">Joined</span>}
                            </div>
                            <h3 className="text-white font-black text-sm m-0 mb-1">{t.name}</h3>
                            <p className="text-white/70 text-xs m-0 leading-normal">{t.description}</p>
                          </div>

                          {isJoined ? (
                            <button onClick={() => handleLeave(t.id)} disabled={isBusy}
                              className={`py-2 px-4 rounded-lg border border-white/15 bg-transparent text-white/70 text-[11px] font-bold uppercase tracking-[0.08em] shrink-0 ${isBusy ? 'cursor-default' : 'cursor-pointer hover:border-red-400 hover:text-red-400'}`}
                            >{isBusy ? <Spinner size={11} /> : 'Leave'}</button>
                          ) : (
                            <button onClick={() => canAct && handleJoin(t.id)} disabled={!canAct || isBusy}
                              className={`py-2 px-4 rounded-lg border-none text-[11px] font-black uppercase tracking-[0.08em] shrink-0 ${canAct ? 'bg-accent text-bg' : 'bg-white/7 text-white/70'} ${canAct && !isBusy ? 'cursor-pointer hover:bg-accent-hover' : 'cursor-default'}`}
                            >{isBusy ? <Spinner size={11} /> : 'Join'}</button>
                          )}
                        </div>

                        <div className="flex gap-4 mb-2.5">
                          {t.prize && <span className="text-white/70 text-[11px]">Prize: {t.prize}</span>}
                          <span className="text-white/70 text-[11px]">{fmt(t.startDate)} – {fmt(t.endDate)}</span>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-white/70 text-[10px] uppercase tracking-widest">Participants</span>
                            <span className="text-white/70 text-[10px] font-bold">{t.participants.length.toLocaleString()} / {t.maxParticipants.toLocaleString()}</span>
                          </div>
                          <div className="h-0.75 bg-white/7 rounded-xs overflow-hidden">
                            <div style={{ width: `${Math.min(pct, 100)}%` }} className="h-full bg-accent rounded-xs" />
                          </div>
                          {t.participants.length > 0 && (
                            <div className="flex gap-1.25 mt-1.75 flex-wrap">
                              {t.participants.slice(0, 6).map((addr) => (
                                <span key={addr} className={`text-[10px] font-semibold py-0.5 px-2 rounded-sm font-mono ${addr === wallet ? 'bg-accent/12 text-accent' : 'bg-white/5 text-white/70'}`}>
                                  {shortWallet(addr)}
                                </span>
                              ))}
                              {t.participants.length > 6 && <span className="text-white/70 text-[10px] py-0.5 px-0">+{t.participants.length - 6} more</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {tab === 'leaderboard' && <LeaderboardPanel wallet={wallet} />}
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[6px]" />
          <div
            className="relative z-10 w-full max-w-115 bg-panel border border-white/10 rounded-[20px] pt-7 px-6 pb-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setShowCreate(false)} className="absolute top-3.5 right-3.5 bg-white/7 border-none cursor-pointer w-8 h-8 rounded-full text-white/70 text-sm flex items-center justify-center">✕</button>

            <h3 className="text-white font-black text-base uppercase tracking-[0.08em] m-0 mb-1">Create Tournament</h3>
            <p className="text-white/70 text-xs m-0 mb-5.5">Set up your own league for World Cup 2026</p>

            <div className="flex flex-col gap-3.5">
              <InputRow label="Tournament Name *">
                <input value={form.name} onChange={e => field('name', e.target.value)} placeholder="e.g. Friday Night Fantasy" maxLength={60} className={inputClass} />
              </InputRow>
              <InputRow label="Description">
                <textarea value={form.description} onChange={e => field('description', e.target.value)} placeholder="What is this tournament about?" maxLength={200} rows={3}
                  className={`${inputClass} resize-none leading-normal`} />
              </InputRow>
              <InputRow label="Prize / Reward">
                <input value={form.prize} onChange={e => field('prize', e.target.value)} placeholder="e.g. Bragging rights, £50 prize pool…" maxLength={100} className={inputClass} />
              </InputRow>
              <div className="grid grid-cols-2 max-[480px]:grid-cols-1 gap-3">
                <InputRow label="Start Date *">
                  <input type="date" value={form.startDate} onChange={e => field('startDate', e.target.value)} className={`${inputClass} scheme-dark`} />
                </InputRow>
                <InputRow label="End Date *">
                  <input type="date" value={form.endDate} onChange={e => field('endDate', e.target.value)} className={`${inputClass} scheme-dark`} />
                </InputRow>
              </div>
              <div className="grid grid-cols-2 max-[480px]:grid-cols-1 gap-3">
                <InputRow label="Max Participants">
                  <input type="number" min={2} max={100000} value={form.maxParticipants} onChange={e => field('maxParticipants', Number(e.target.value))} className={inputClass} />
                </InputRow>
                <InputRow label="Status">
                  <select value={form.status} onChange={e => field('status', e.target.value as 'open' | 'active')} className={`${inputClass} cursor-pointer`}>
                    <option value="open">Open</option>
                    <option value="active">Active / Live</option>
                  </select>
                </InputRow>
              </div>
              {createError && <p className="text-red-400 text-xs m-0">{createError}</p>}
              <div className="flex gap-2.5 mt-1">
                <button onClick={() => setShowCreate(false)}
                  className="flex-1 p-3 rounded-[10px] border border-white/12 bg-transparent text-white/70 font-bold text-xs uppercase tracking-[0.08em] cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleCreate} disabled={creating}
                  className={`flex-2 p-3 rounded-[10px] border-none text-bg font-black text-xs uppercase tracking-[0.08em] flex items-center justify-center gap-1.5 ${creating ? 'bg-accent/50 cursor-default' : 'bg-accent hover:bg-accent-hover cursor-pointer'}`}>
                  {creating && <Spinner size={12} />}
                  {creating ? 'Creating…' : 'Create Tournament'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
