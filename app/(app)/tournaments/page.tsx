'use client'
import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useAccountId } from '@/lib/useAccountId'
import { useSquadStore, isComplete } from '@/store/squadStore'
import { tournamentApi } from '@/lib/api/tournamentApi'
import type { Tournament, CreateTournamentInput } from '@/lib/api/tournamentApi'
import { useTournamentProgram } from '@/lib/solana/useTournamentProgram'
import { deriveEntryPda, CREATION_FEE_LAMPORTS } from '@/lib/solana/tournamentProgram'
import { getTreasuryAddress, SOLANA_NETWORK } from '@/lib/solana/network'
import { scoresApi } from '@/lib/api/scoresApi'
import type { SquadLiveScore, GoalEvent, Fixture, MatchLiveScore } from '@/lib/api/scoresApi'
import FlagImg from '@/components/FlagImg'
import { resolveTeam, teamCode } from '@/lib/resolveTeam'
import Spinner, { LoadingState } from '@/components/Spinner'

const STATUS_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  open:   { label: 'Open',  bg: 'rgba(0,255,135,0.12)',   color: '#00FF87' },
  active: { label: 'Live',  bg: 'rgba(250,204,21,0.12)',  color: '#facc15' },
  ended:  { label: 'Ended', bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' },
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
// A tournament is done once its end date has passed, regardless of whatever
// `status` was set to at creation — that field never auto-transitions on its
// own, so a tournament left as "open"/"active" past its end date would
// otherwise still let people join or leave it forever.
function isTournamentEnded(t: { status: string; endDate: string }) {
  return t.status === 'ended' || new Date(t.endDate).getTime() < Date.now()
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

function pad(n: number) { return String(n).padStart(2, '0') }
function localDateValue(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` }
function localTimeValue(d: Date) { return `${pad(d.getHours())}:${pad(d.getMinutes())}` }

// "Start immediately" in practice means a few minutes from now, not this
// exact instant — the on-chain program requires start_time to be strictly in
// the future (join_tournament also closes joining once it passes), so the
// creator's own auto-join right after creation needs a real window to land in.
function defaultStart() { return new Date(Date.now() + 5 * 60_000) }
function defaultEnd()   { return new Date(Date.now() + 24 * 60 * 60_000) }

function explorerTxUrl(signature: string) {
  const cluster = SOLANA_NETWORK === 'mainnet-beta' ? '' : `?cluster=${SOLANA_NETWORK}`
  return `https://explorer.solana.com/tx/${signature}${cluster}`
}

const EMPTY_FORM: CreateTournamentInput = {
  name: '', description: '', prize: '', status: 'open',
  startDate: localDateValue(defaultStart()), endDate: localDateValue(defaultEnd()), maxParticipants: 500,
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

interface RankedParticipant extends SquadLiveScore { hasSquad: boolean }

function rankWithin(rows: SquadLiveScore[], participants: string[]): RankedParticipant[] {
  const byWallet = new Map(rows.map((r) => [r.walletAddress, r]))
  const merged: RankedParticipant[] = participants.map((addr) => {
    const row = byWallet.get(addr)
    return row
      ? { ...row, hasSquad: true }
      : { walletAddress: addr, squadName: 'No squad yet', totalPoints: 0, rank: 0, players: [], hasSquad: false }
  })
  merged.sort((a, b) => b.totalPoints - a.totalPoints)
  merged.forEach((r, i) => { r.rank = i + 1 })
  return merged
}

// Shared by both the podium and the regular list rows — renders one squad's
// 5-player point breakdown, scoped to whatever range query the parent
// already fetched for the currently-open wallet.
function PlayerBreakdown({ row, rangePoints, isLoading }: {
  row: RankedParticipant; rangePoints: Record<string, number> | undefined; isLoading: boolean
}) {
  return (
    <div className="px-2.5 pb-2.5">
      {isLoading && <div className="pb-1"><Spinner size={12} /></div>}
      <div className="flex gap-1.5 flex-wrap">
        {row.players.map((p) => {
          // rangePoints has no entry for a player with 0 points that day —
          // treat "known but absent" as 0, not "still loading."
          const pts = rangePoints ? (rangePoints[p.playerId] ?? 0) : p.points
          return (
            <div key={p.playerId} className={`rounded-lg py-1.25 px-2.25 min-w-15 ${pts > 0 ? 'bg-accent/8' : 'bg-white/4'}`}>
              <div className={`text-[10px] font-bold ${pts > 0 ? 'text-accent' : 'text-white/70'}`}>{p.name.split(' ').pop()}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-white/70 text-[9px] uppercase">{p.position}</span>
                {p.goals > 0 && <span className="text-[9px]">⚽{p.goals}</span>}
                {p.assists > 0 && <span className="text-[9px] text-blue-400">A{p.assists}</span>}
                {p.yellowCards > 0 && <span className="text-[9px]">🟨</span>}
                {p.redCards > 0 && <span className="text-[9px]">🟥</span>}
                <span className={`text-[10px] font-bold ml-0.5 ${pts > 0 ? 'text-accent' : 'text-white/70'}`}>{pts > 0 ? `+${pts}` : '0'}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// The leaderboard's per-row `players[].points` only reflects *today's* live
// session — a squad's historical points (already rolled into the DB total
// shown as `totalPoints`) aren't attached to any player there once the day
// rolls over. `displayTotal` comes from the parent's range-scoped query for
// whichever wallet is currently open, so the number shown actually sums to
// something meaningful for this tournament (not the wallet's whole career,
// and not just "whatever happened today").
function ParticipantRow({
  row, isMe, isOpen, onToggle, displayTotal, rangePoints, isLoadingRange,
}: {
  row: RankedParticipant; isMe: boolean; isOpen: boolean; onToggle: () => void
  displayTotal: number; rangePoints: Record<string, number> | undefined; isLoadingRange: boolean
}) {
  return (
    <div className={`rounded-lg ${isMe ? 'bg-accent/6' : 'bg-white/3'} ${!row.hasSquad ? 'opacity-60' : ''}`}>
      <div
        onClick={() => row.hasSquad && onToggle()}
        className={`flex items-center gap-2.5 py-2 px-2.5 ${row.hasSquad ? 'cursor-pointer' : ''}`}
      >
        <div className="w-5 text-center text-[10px] font-black text-white/70 shrink-0">#{row.rank}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`font-bold text-xs ${isMe ? 'text-accent' : row.hasSquad ? 'text-white' : 'text-white/50 italic'}`}>{row.squadName}</span>
            {isMe && <span className="bg-accent/12 text-accent text-[9px] font-black uppercase tracking-widest py-px px-1.5 rounded-sm">You</span>}
          </div>
          <span className="text-white/70 text-[10px] font-mono">{shortWallet(row.walletAddress)}</span>
        </div>
        <div className="text-right shrink-0">
          <span className={`font-black text-sm ${row.hasSquad ? 'text-white' : 'text-white/40'}`}>{row.hasSquad ? displayTotal : '–'}</span>
          {row.hasSquad && <span className="text-white/70 text-[9px] uppercase ml-1">pts</span>}
        </div>
      </div>

      {isOpen && row.hasSquad && <PlayerBreakdown row={row} rangePoints={rangePoints} isLoading={isLoadingRange} />}
    </div>
  )
}

// Compact vertical card for the top-3 podium row. Clicking it opens the same
// breakdown as any other row — but rendered by the parent, full-width, below
// the podium grid rather than cramped inside a one-third-width column.
function PodiumCard({ row, isMe, isOpen, onToggle, displayTotal }: {
  row: RankedParticipant; isMe: boolean; isOpen: boolean; onToggle: () => void; displayTotal: number
}) {
  const medal = row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : '🥉'
  return (
    <div
      onClick={() => row.hasSquad && onToggle()}
      className={`flex flex-col items-center text-center gap-0.5 rounded-lg py-3 px-2 border ${isMe ? 'bg-accent/6 border-accent/20' : 'bg-white/3 border-white/7'} ${row.hasSquad ? 'cursor-pointer' : 'opacity-60'} ${isOpen ? 'ring-1 ring-accent/50' : ''}`}
    >
      <div className="text-lg leading-none mb-0.5">{medal}</div>
      <div className={`font-bold text-[11px] truncate w-full ${isMe ? 'text-accent' : row.hasSquad ? 'text-white' : 'text-white/50 italic'}`}>{row.squadName}</div>
      <div className="text-white/70 text-[9px] font-mono truncate w-full">{shortWallet(row.walletAddress)}</div>
      <div className="mt-0.5">
        <span className={`font-black text-sm ${row.hasSquad ? 'text-white' : 'text-white/40'}`}>{row.hasSquad ? displayTotal : '–'}</span>
        {row.hasSquad && <span className="text-white/70 text-[9px] uppercase ml-0.5">pts</span>}
      </div>
      {isMe && <span className="bg-accent/12 text-accent text-[8px] font-black uppercase tracking-widest py-px px-1.5 rounded-sm mt-1">You</span>}
    </div>
  )
}

function TournamentParticipants({
  participants, wallet, startDate, endDate,
}: { participants: string[]; wallet: string; startDate: string; endDate: string }) {
  const leaderboardQuery = useQuery({ queryKey: ['leaderboard'], queryFn: scoresApi.leaderboard })
  const [liveRows, setLiveRows] = useState<SquadLiveScore[] | null>(null)
  const [openWallet, setOpenWallet] = useState<string | null>(null)

  useEffect(() => {
    setLiveRows(null)
    return scoresApi.subscribeToLive({ onLeaderboard: setLiveRows })
  }, [])

  const rows    = rankWithin(liveRows ?? leaderboardQuery.data ?? [], participants)
  const openRow = rows.find((r) => r.walletAddress === openWallet) ?? null

  const rangeQuery = useQuery({
    queryKey: ['tournament-points', openWallet, startDate, endDate],
    queryFn: () => scoresApi.pointsInRange(openWallet!, startDate.slice(0, 10), endDate.slice(0, 10)),
    enabled: !!openWallet && !!openRow?.hasSquad,
  })
  const rangePoints = rangeQuery.data
  const rangeTotal   = rangePoints ? Object.values(rangePoints).reduce((s, n) => s + n, 0) : null
  const displayTotalFor = (row: RankedParticipant) =>
    row.walletAddress === openWallet && rangeTotal != null ? rangeTotal : row.totalPoints

  if (leaderboardQuery.isLoading && !liveRows) return <div className="pt-3"><Spinner size={14} /></div>
  if (leaderboardQuery.isError && !liveRows)   return <p className="text-red-400 text-[11px] pt-3">Could not load rankings</p>

  const top3 = rows.slice(0, 3)
  const rest = rows.slice(3)
  const openInTop3 = openRow && top3.some((r) => r.walletAddress === openRow.walletAddress)

  return (
    <div className="pt-3 border-t border-white/6 mt-3">
      {top3.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-2">
          {top3.map((row) => (
            <PodiumCard
              key={row.walletAddress}
              row={row}
              isMe={row.walletAddress === wallet}
              isOpen={openWallet === row.walletAddress}
              onToggle={() => setOpenWallet(openWallet === row.walletAddress ? null : row.walletAddress)}
              displayTotal={displayTotalFor(row)}
            />
          ))}
        </div>
      )}

      {openInTop3 && openRow && openRow.hasSquad && (
        <div className="mb-2 rounded-lg bg-white/3">
          <PlayerBreakdown row={openRow} rangePoints={rangePoints} isLoading={rangeQuery.isLoading} />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        {rest.map((row) => (
          <ParticipantRow
            key={row.walletAddress}
            row={row}
            isMe={row.walletAddress === wallet}
            isOpen={openWallet === row.walletAddress}
            onToggle={() => setOpenWallet(openWallet === row.walletAddress ? null : row.walletAddress)}
            displayTotal={displayTotalFor(row)}
            rangePoints={openWallet === row.walletAddress ? rangePoints : undefined}
            isLoadingRange={openWallet === row.walletAddress && rangeQuery.isLoading}
          />
        ))}
      </div>
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
  const [expandedId,  setExpandedId]  = useState<string | null>(null)
  const [showCreate,  setShowCreate]  = useState(false)
  const [form,        setForm]        = useState<CreateTournamentInput>(EMPTY_FORM)
  const [startTime,   setStartTime]   = useState(localTimeValue(defaultStart()))
  const [endTime,     setEndTime]     = useState(localTimeValue(defaultEnd()))
  const [entryFeeSol, setEntryFeeSol] = useState('0.1')
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

  const program = useTournamentProgram()

  const createMutation = useMutation({
    mutationFn: async (input: CreateTournamentInput) => {
      const toastId = toast.loading('Creating tournament…')

      try {
        if (!program || !program.provider.publicKey) {
          throw new Error('Connect a Solana wallet to create a tournament')
        }
        const creator = program.provider.publicKey

        const entryFeeLamports = Math.round(Number(entryFeeSol) * LAMPORTS_PER_SOL)
        if (!Number.isFinite(entryFeeLamports) || entryFeeLamports <= 0) {
          throw new Error('Entry fee must be a positive number of SOL')
        }

        // Date + time inputs combine into a plain "YYYY-MM-DDTHH:MM" string,
        // which Date parses in the browser's local timezone (no offset suffix).
        const startDateTime = new Date(`${input.startDate}T${startTime}`)
        const endDateTime = new Date(`${input.endDate}T${endTime}`)
        if (startDateTime.getTime() <= Date.now()) {
          throw new Error('Start time must be in the future')
        }
        if (endDateTime.getTime() <= startDateTime.getTime()) {
          throw new Error('End time must be after the start time')
        }

        // 1. Backend (fixed authority) creates the Tournament on-chain.
        toast.loading('Creating tournament on-chain…', { id: toastId })
        const created = await tournamentApi.createOnChain({
          name: input.name,
          description: input.description,
          prize: input.prize,
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
          maxParticipants: input.maxParticipants,
          entryFeeLamports,
          payoutTable: [{ rank: 1, basisPoints: 10_000 }], // winner takes all, for now
        })
        if (!created.tournamentPda) throw new Error('Tournament was not created on-chain')
        const tournamentPda = new PublicKey(created.tournamentPda)

        // 2. One transaction, one signature: the flat 0.01 SOL creation fee to
        // the treasury, plus the creator's own entry-fee payment (join_tournament)
        // so they're a real, prize-eligible participant — not just listed.
        toast.loading('Confirm the payment in your wallet…', { id: toastId })
        const [entryPda] = deriveEntryPda(tournamentPda, creator)
        const joinIx = await program.methods
          .joinTournament()
          .accounts({
            participant: creator,
            tournament: tournamentPda,
            entry: entryPda,
            systemProgram: SystemProgram.programId,
          })
          .instruction()
        const feeIx = SystemProgram.transfer({
          fromPubkey: creator,
          toPubkey: getTreasuryAddress(),
          lamports: CREATION_FEE_LAMPORTS,
        })
        const txSig = await program.provider.sendAndConfirm!(new Transaction().add(feeIx, joinIx))

        // 3. Record the creator's participation off-chain.
        toast.loading('Finishing up…', { id: toastId })
        const tournament = await tournamentApi.join(created.id, wallet)

        toast.success(
          <span>
            Tournament created — you&apos;re in!{' '}
            <a href={explorerTxUrl(txSig)} target="_blank" rel="noreferrer" className="underline text-accent">
              View transaction
            </a>
          </span>,
          { id: toastId, duration: 10_000 },
        )
        return tournament
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to create tournament', { id: toastId })
        throw err
      }
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Tournament[]>(['tournaments'], (prev) => [updated, ...(prev ?? [])])
      setShowCreate(false)
      setForm(EMPTY_FORM)
      setStartTime(localTimeValue(defaultStart()))
      setEndTime(localTimeValue(defaultEnd()))
      setEntryFeeSol('0.1')
    },
    onError: (err) => {
      console.error('[tournaments] failed to create tournament', err)
      setCreateError(err instanceof Error ? err.message : 'Failed to create')
    },
  })

  const joinMutation = useMutation({
    mutationFn: async (id: string) => {
      const target = tournaments.find((t) => t.id === id)

      // Paid tournament (has a real on-chain vault) — the participant's own
      // wallet must sign a join_tournament transaction to pay the entry fee
      // before we record the join off-chain. Free tournaments (no on-chain
      // counterpart) skip this entirely, unchanged from before.
      if (target?.tournamentPda && target.entryFeeLamports != null) {
        if (!program || !program.provider.publicKey) {
          throw new Error('Connect a Solana wallet to join a paid tournament (Google sign-in alone can\'t pay an entry fee)')
        }
        const participant = program.provider.publicKey
        const tournamentPda = new PublicKey(target.tournamentPda)
        const [entryPda] = deriveEntryPda(tournamentPda, participant)

        await program.methods
          .joinTournament()
          .accounts({
            participant,
            tournament: tournamentPda,
            entry: entryPda,
            systemProgram: SystemProgram.programId,
          })
          .rpc()
      }

      return tournamentApi.join(id, wallet)
    },
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
          <p className="text-white/70 text-[11px] mt-0.5 tracking-wider">Live scores &amp; leaderboard</p>
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
                    const ended       = isTournamentEnded(t)
                    const statusStyle = STATUS_STYLE[ended ? 'ended' : t.status] ?? STATUS_STYLE.open
                    const pct         = Math.round((t.participants.length / t.maxParticipants) * 100)
                    const canAct      = connected && hasSquad && !ended
                    const isExpanded  = expandedId === t.id

                    return (
                      <div
                        key={t.id}
                        onClick={() => setExpandedId(isExpanded ? null : t.id)}
                        className={`rounded-[14px] py-4.5 px-5 border cursor-pointer ${isJoined ? 'bg-accent/4 border-accent/18' : 'bg-white/3 border-white/7'}`}
                      >
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
                            <button onClick={(e) => { e.stopPropagation(); !ended && handleLeave(t.id) }} disabled={ended || isBusy}
                              className={`py-2 px-4 rounded-lg border border-white/15 bg-transparent text-white/70 text-[11px] font-bold uppercase tracking-[0.08em] shrink-0 ${ended ? 'opacity-40 cursor-default' : isBusy ? 'cursor-default' : 'cursor-pointer hover:border-red-400 hover:text-red-400'}`}
                            >{isBusy ? <Spinner size={11} /> : 'Leave'}</button>
                          ) : (
                            <button onClick={(e) => { e.stopPropagation(); canAct && handleJoin(t.id) }} disabled={!canAct || isBusy}
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

                        <div className="flex items-center justify-center gap-1 mt-3 text-white/70 text-[10px] font-bold uppercase tracking-widest">
                          {isExpanded ? 'Hide ranking' : 'Show ranking'}
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
                        </div>

                        {isExpanded && (
                          <div onClick={(e) => e.stopPropagation()}>
                            {t.participants.length === 0 ? (
                              <p className="text-white/70 text-[11px] pt-3 text-center">No one has joined yet.</p>
                            ) : (
                              <TournamentParticipants participants={t.participants} wallet={wallet} startDate={t.startDate} endDate={t.endDate} />
                            )}
                          </div>
                        )}
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
            <p className="text-white/70 text-xs m-0 mb-5.5">Set up your own private league</p>

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
                <InputRow label="Start Time *">
                  <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className={`${inputClass} scheme-dark`} />
                </InputRow>
              </div>
              <div className="grid grid-cols-2 max-[480px]:grid-cols-1 gap-3">
                <InputRow label="End Date *">
                  <input type="date" value={form.endDate} onChange={e => field('endDate', e.target.value)} className={`${inputClass} scheme-dark`} />
                </InputRow>
                <InputRow label="End Time *">
                  <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className={`${inputClass} scheme-dark`} />
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
              <InputRow label="Entry Fee (SOL) *">
                <input type="number" min={0.001} step={0.001} value={entryFeeSol} onChange={e => setEntryFeeSol(e.target.value)} className={inputClass} />
              </InputRow>
              <p className="text-white/70 text-[11px] m-0 leading-relaxed bg-white/3 border border-white/8 rounded-[10px] p-2.5">
                Real on-chain money: your wallet pays a flat <span className="text-accent font-bold">0.01 SOL</span> creation
                fee plus the entry fee above (winner takes the whole pool) in one signature — you&apos;re automatically
                entered as the first participant.
              </p>
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
