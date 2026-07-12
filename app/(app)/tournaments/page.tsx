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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px', padding: '9px 12px',
  color: '#fff', fontSize: '13px', outline: 'none',
}

function GoalToast({ event, onDone }: { event: GoalEvent; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: '#facc15', color: '#0a0e1a', borderRadius: '12px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 32px rgba(250,204,21,0.4)' }}>
      <span style={{ fontSize: '20px' }}>⚽</span>
      <div>
        <div style={{ fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GOAL! {event.playerName}</div>
        <div style={{ fontSize: '11px', opacity: 0.75 }}>{event.teamName} · {event.score} · {event.minute}&apos;</div>
      </div>
      <button onClick={onDone} style={{ marginLeft: '4px', background: 'rgba(0,0,0,0.15)', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', color: '#0a0e1a', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
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
  if (rows.length === 0) return <div style={{ textAlign: 'center', marginTop: '60px' }}><p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>No squads yet — be the first to join a tournament!</p></div>

  return (
    <>
      {toast && <GoalToast event={toast} onDone={() => setToast(null)} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: live ? '#00FF87' : '#facc15', boxShadow: live ? '0 0 6px #00FF87' : 'none' }} />
        <span style={{ color: live ? '#00FF87' : 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: 700 }}>{live ? 'Live' : 'Last snapshot'} — {rows.length} squads</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {rows.map((row) => {
          const isMe = row.walletAddress === wallet
          const topScorer = row.players.reduce((a, b) => b.points > a.points ? b : a, row.players[0])
          return (
            <div key={row.walletAddress} style={{ background: isMe ? 'rgba(0,255,135,0.05)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isMe ? 'rgba(0,255,135,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '14px', padding: '14px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: row.rank === 1 ? '#facc15' : row.rank === 2 ? 'rgba(255,255,255,0.15)' : row.rank === 3 ? 'rgba(205,127,50,0.4)' : 'rgba(255,255,255,0.06)', color: row.rank <= 2 ? '#0a0e1a' : '#fff', fontSize: '12px', fontWeight: 900 }}>
                  {row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : `#${row.rank}`}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: isMe ? '#00FF87' : '#fff', fontWeight: 900, fontSize: '14px' }}>{row.squadName}</span>
                    {isMe && <span style={{ background: 'rgba(0,255,135,0.12)', color: '#00FF87', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '1px 6px', borderRadius: '4px' }}>You</span>}
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontFamily: 'monospace' }}>{shortWallet(row.walletAddress)}</span>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ color: isMe ? '#00FF87' : '#fff', fontSize: '22px', fontWeight: 900, lineHeight: 1 }}>{row.totalPoints}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>pts</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {row.players.map((p) => (
                  <div key={p.playerId} style={{ background: p.points > 0 ? 'rgba(0,255,135,0.08)' : 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '5px 9px', minWidth: '60px' }}>
                    <div style={{ color: p.points > 0 ? '#00FF87' : 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 700 }}>{p.name.split(' ').pop()}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', textTransform: 'uppercase' }}>{p.position}</span>
                      {p.goals > 0 && <span style={{ fontSize: '9px' }}>⚽{p.goals}</span>}
                      {p.assists > 0 && <span style={{ fontSize: '9px', color: '#60a5fa' }}>A{p.assists}</span>}
                      {p.yellowCards > 0 && <span style={{ fontSize: '9px' }}>🟨</span>}
                      {p.redCards > 0 && <span style={{ fontSize: '9px' }}>🟥</span>}
                      <span style={{ color: p.points > 0 ? '#00FF87' : 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 700, marginLeft: '2px' }}>{p.points > 0 ? `+${p.points}` : '0'}</span>
                    </div>
                  </div>
                ))}
              </div>
              {topScorer && topScorer.points > 0 && (
                <div style={{ marginTop: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '10px' }}>
                  Top scorer: <span style={{ color: '#facc15', fontWeight: 700 }}>{topScorer.name}</span> · {topScorer.points} pts
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
    <div style={{ background: isLive ? 'rgba(250,204,21,0.04)' : '#0d1320', border: `1px solid ${isLive ? 'rgba(250,204,21,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '14px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {stage}
          {!isLive && !isFinished && <> · <span style={{ color: 'rgba(255,255,255,0.7)' }}>{fmtTime(f.startTime)}</span></>}
          {isLive && minute != null && <> · <span style={{ color: '#facc15' }}>{minute}&apos;</span></>}
          {isFinished && <> · <span style={{ color: 'rgba(255,255,255,0.7)' }}>FT</span></>}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isLive && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#facc15', boxShadow: '0 0 5px #facc15' }} />
              <span style={{ color: '#facc15', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live</span>
            </div>
          )}
          {roundLbl && <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{roundLbl}</span>}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', gap: '8px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px' }}>
          <FlagImg country={resolveTeam(f.homeTeam)} size={32} shape="rect" />
          <span style={{ color: '#fff', fontWeight: 800, fontSize: '13px', textAlign: 'center' }}>{f.homeTeam}</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em' }}>{teamCode(f.homeTeam)}</span>
        </div>

        <div style={{ flexShrink: 0, textAlign: 'center', minWidth: '90px' }}>
          {hasScore ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <span style={{ color: isLive ? '#facc15' : '#fff', fontWeight: 900, fontSize: '28px', lineHeight: 1 }}>{homeScore}</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 300, fontSize: '20px' }}>–</span>
                <span style={{ color: isLive ? '#facc15' : '#fff', fontWeight: 900, fontSize: '28px', lineHeight: 1 }}>{awayScore}</span>
              </div>
              {isLive && <div style={{ color: '#facc15', fontSize: '10px', fontWeight: 700, marginTop: '3px' }}>{periodLabel ?? (minute != null ? `${minute}'` : 'Live')}</div>}
              {isFinished && <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '3px' }}>{periodLabel ?? 'FT'}</div>}
            </div>
          ) : isLive ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#facc15', boxShadow: '0 0 5px #facc15' }} />
                <span style={{ color: '#facc15', fontWeight: 900, fontSize: '12px', letterSpacing: '0.1em' }}>LIVE</span>
              </div>
              {minute != null && <div style={{ color: '#facc15', fontSize: '10px', marginTop: '3px' }}>{minute}&apos;</div>}
            </div>
          ) : isFinished ? (
            <div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '14px' }}>{fmtTime(f.startTime)}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '3px' }}>Full Time</div>
            </div>
          ) : (
            <div>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 900, fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>VS</span>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', marginTop: '4px' }}>{fmtDate(f.startTime)}</div>
            </div>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px' }}>
          <FlagImg country={resolveTeam(f.awayTeam)} size={32} shape="rect" />
          <span style={{ color: '#fff', fontWeight: 800, fontSize: '13px', textAlign: 'center' }}>{f.awayTeam}</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em' }}>{teamCode(f.awayTeam)}</span>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ label, count, color = 'rgba(255,255,255,0.7)' }: { label: string; count: number; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', marginBottom: '8px' }}>
      <span style={{ color, fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{label}</span>
      <span style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 700, padding: '1px 7px', borderRadius: '10px' }}>{count}</span>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
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
  if (matchesQuery.isError)   return <p style={{ color: '#f87171', fontSize: '13px', textAlign: 'center', marginTop: '60px' }}>Could not load matches — server may be starting up</p>
  if (!data)   return null

  const todayAll = [...(data.live ?? []), ...(data.today ?? [])]
  const total    = todayAll.length + data.finished.length + data.upcoming.length
  if (total === 0) return <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', textAlign: 'center', marginTop: '60px' }}>No matches found</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {todayAll.length > 0 && (
        <>
          <SectionHeader label="Today" count={todayAll.length} color="#facc15" />
          <div className="match-grid" style={{ gap: '8px' }}>
            {data.live.map((f) => <MatchCard key={f.fixtureId} f={f} liveOverride={liveMap[f.fixtureId]} />)}
            {(data.today ?? []).map((f) => <MatchCard key={f.fixtureId} f={f} liveOverride={liveMap[f.fixtureId]} />)}
          </div>
        </>
      )}
      {data.upcoming.length > 0 && (
        <>
          <SectionHeader label="Upcoming" count={data.upcoming.length} color="#60a5fa" />
          <div className="match-grid" style={{ gap: '8px' }}>{data.upcoming.map((f) => <MatchCard key={f.fixtureId} f={f} />)}</div>
        </>
      )}
      {data.finished.length > 0 && (
        <>
          <SectionHeader label="Results" count={data.finished.length} color="rgba(255,255,255,0.7)" />
          <div className="match-grid" style={{ gap: '8px' }}>{data.finished.map((f) => <MatchCard key={f.fixtureId} f={f} />)}</div>
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
    <div className="flex-1 flex flex-col overflow-hidden" style={{ minHeight: 0, background: '#0a0e1a' }}>

      <div className="builder-header-row" style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0, background: 'rgba(255,255,255,0.02)' }}>
        <div>
          <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>VSquad Hub</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '2px', letterSpacing: '0.05em' }}>FIFA World Cup 2026 · Live scores &amp; leaderboard</p>
        </div>
        {tab === 'tournaments' && connected && (
          <button
            onClick={() => setShowCreate(true)}
            style={{ padding: '7px 14px', borderRadius: '8px', border: 'none', background: '#00FF87', color: '#0a0e1a', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#00e07a')}
            onMouseLeave={e => (e.currentTarget.style.background = '#00FF87')}
          >
            + Create
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '2px', padding: '10px 24px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0, background: 'rgba(255,255,255,0.01)' }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '7px 14px', borderRadius: '8px 8px 0 0', border: 'none', background: tab === t.id ? 'rgba(0,255,135,0.1)' : 'transparent', color: tab === t.id ? '#00FF87' : 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: tab === t.id ? 900 : 600, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', borderBottom: tab === t.id ? '2px solid #00FF87' : '2px solid transparent', transition: 'all 0.15s' }}
          >
            {t.label}
            {t.id === 'leaderboard' && (
              <span style={{ marginLeft: '5px', display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#00FF87', boxShadow: '0 0 4px #00FF87', verticalAlign: 'middle' }} />
            )}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0, padding: '20px 24px', minWidth: 0 }}>

          {tab === 'tournaments' && (
            <>
              {!connected && (
                <div style={{ background: 'rgba(250,204,21,0.06)', border: '1px solid rgba(250,204,21,0.15)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <p style={{ color: '#facc15', fontSize: '12px', fontWeight: 600, margin: 0 }}>Sign in to join or create a tournament</p>
                </div>
              )}
              {connected && !hasSquad && (
                <div style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <p style={{ color: '#60a5fa', fontSize: '12px', fontWeight: 600, margin: 0 }}>Build and save your squad first to join tournaments</p>
                </div>
              )}

              {loading && <LoadingState label="Loading tournaments…" />}
              {error   && <p style={{ color: '#f87171', fontSize: '13px', textAlign: 'center', marginTop: '60px' }}>{error}</p>}

              {!loading && !error && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {tournaments.map((t) => {
                    const isJoined    = wallet ? t.participants.includes(wallet) : false
                    const isBusy      = busy === t.id
                    const statusStyle = STATUS_STYLE[t.status] ?? STATUS_STYLE.open
                    const pct         = Math.round((t.participants.length / t.maxParticipants) * 100)
                    const canAct      = connected && hasSquad && t.status !== 'ended'

                    return (
                      <div key={t.id} style={{ background: isJoined ? 'rgba(0,255,135,0.04)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isJoined ? 'rgba(0,255,135,0.18)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '14px', padding: '18px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                              <span style={{ background: statusStyle.bg, color: statusStyle.color, fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '2px 8px', borderRadius: '5px' }}>{statusStyle.label}</span>
                              {isJoined && <span style={{ background: 'rgba(0,255,135,0.12)', color: '#00FF87', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 8px', borderRadius: '5px' }}>Joined</span>}
                            </div>
                            <h3 style={{ color: '#fff', fontWeight: 900, fontSize: '14px', margin: '0 0 4px' }}>{t.name}</h3>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>{t.description}</p>
                          </div>

                          {isJoined ? (
                            <button onClick={() => handleLeave(t.id)} disabled={isBusy}
                              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: isBusy ? 'default' : 'pointer', flexShrink: 0 }}
                              onMouseEnter={e => { if (!isBusy) { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.color = '#f87171' } }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
                            >{isBusy ? <Spinner size={11} /> : 'Leave'}</button>
                          ) : (
                            <button onClick={() => canAct && handleJoin(t.id)} disabled={!canAct || isBusy}
                              style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: canAct ? '#00FF87' : 'rgba(255,255,255,0.07)', color: canAct ? '#0a0e1a' : 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: canAct && !isBusy ? 'pointer' : 'default', flexShrink: 0 }}
                              onMouseEnter={e => { if (canAct && !isBusy) e.currentTarget.style.background = '#00e07a' }}
                              onMouseLeave={e => { if (canAct && !isBusy) e.currentTarget.style.background = '#00FF87' }}
                            >{isBusy ? <Spinner size={11} /> : 'Join'}</button>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
                          {t.prize && <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>Prize: {t.prize}</span>}
                          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>{fmt(t.startDate)} – {fmt(t.endDate)}</span>
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Participants</span>
                            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 700 }}>{t.participants.length.toLocaleString()} / {t.maxParticipants.toLocaleString()}</span>
                          </div>
                          <div style={{ height: '3px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: '#00FF87', borderRadius: '2px' }} />
                          </div>
                          {t.participants.length > 0 && (
                            <div style={{ display: 'flex', gap: '5px', marginTop: '7px', flexWrap: 'wrap' }}>
                              {t.participants.slice(0, 6).map((addr) => (
                                <span key={addr} style={{ background: addr === wallet ? 'rgba(0,255,135,0.12)' : 'rgba(255,255,255,0.05)', color: addr === wallet ? '#00FF87' : 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>
                                  {shortWallet(addr)}
                                </span>
                              ))}
                              {t.participants.length > 6 && <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', padding: '2px 0' }}>+{t.participants.length - 6} more</span>}
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
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setShowCreate(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} />
          <div
            style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '460px', background: '#0f1923', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '28px 24px 24px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setShowCreate(false)} style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(255,255,255,0.07)', border: 'none', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', color: 'rgba(255,255,255,0.7)', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>

            <h3 style={{ color: '#fff', fontWeight: 900, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Create Tournament</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: '0 0 22px' }}>Set up your own league for World Cup 2026</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <InputRow label="Tournament Name *">
                <input value={form.name} onChange={e => field('name', e.target.value)} placeholder="e.g. Friday Night Fantasy" maxLength={60} style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,255,135,0.4)')}
                  onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </InputRow>
              <InputRow label="Description">
                <textarea value={form.description} onChange={e => field('description', e.target.value)} placeholder="What is this tournament about?" maxLength={200} rows={3}
                  style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,255,135,0.4)')}
                  onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </InputRow>
              <InputRow label="Prize / Reward">
                <input value={form.prize} onChange={e => field('prize', e.target.value)} placeholder="e.g. Bragging rights, £50 prize pool…" maxLength={100} style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,255,135,0.4)')}
                  onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </InputRow>
              <div className="grid-2col-tight" style={{ gap: '12px' }}>
                <InputRow label="Start Date *">
                  <input type="date" value={form.startDate} onChange={e => field('startDate', e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,255,135,0.4)')}
                    onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
                </InputRow>
                <InputRow label="End Date *">
                  <input type="date" value={form.endDate} onChange={e => field('endDate', e.target.value)} style={{ ...inputStyle, colorScheme: 'dark' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,255,135,0.4)')}
                    onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
                </InputRow>
              </div>
              <div className="grid-2col-tight" style={{ gap: '12px' }}>
                <InputRow label="Max Participants">
                  <input type="number" min={2} max={100000} value={form.maxParticipants} onChange={e => field('maxParticipants', Number(e.target.value))} style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,255,135,0.4)')}
                    onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
                </InputRow>
                <InputRow label="Status">
                  <select value={form.status} onChange={e => field('status', e.target.value as 'open' | 'active')} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="open">Open</option>
                    <option value="active">Active / Live</option>
                  </select>
                </InputRow>
              </div>
              {createError && <p style={{ color: '#f87171', fontSize: '12px', margin: 0 }}>{createError}</p>}
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button onClick={() => setShowCreate(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={handleCreate} disabled={creating}
                  style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: creating ? 'rgba(0,255,135,0.5)' : '#00FF87', color: '#0a0e1a', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: creating ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onMouseEnter={e => { if (!creating) e.currentTarget.style.background = '#00e07a' }}
                  onMouseLeave={e => { if (!creating) e.currentTarget.style.background = '#00FF87' }}>
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
