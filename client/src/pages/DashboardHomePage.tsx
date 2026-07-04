import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useSquadStore, filledCount, isComplete } from '../store/squadStore'
import { scoresApi } from '../api/scoresApi'
import type { MatchesResponse, SquadLiveScore } from '../api/scoresApi'

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
})

function PositionBadge({ pos }: { pos: string }) {
  const colors: Record<string, [string, string]> = {
    GK:  ['#f59e0b', 'rgba(245,158,11,0.12)'],
    DEF: ['#3b82f6', 'rgba(59,130,246,0.12)'],
    FWD: ['#00FF87', 'rgba(0,255,135,0.12)'],
  }
  const [color, bg] = colors[pos] ?? ['#fff', 'rgba(255,255,255,0.1)']
  return (
    <span style={{
      background: bg, border: `1px solid ${color}33`,
      color, fontSize: '9px', fontWeight: 800, textTransform: 'uppercase',
      letterSpacing: '0.1em', padding: '2px 7px', borderRadius: '5px',
    }}>{pos}</span>
  )
}

function MatchBadge({ status }: { status: 'upcoming' | 'live' | 'finished' }) {
  if (status === 'live') return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#00FF87', fontSize: '10px', fontWeight: 800 }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00FF87', boxShadow: '0 0 6px #00FF87', display: 'inline-block' }} />
      LIVE
    </span>
  )
  if (status === 'finished') return <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', fontWeight: 700 }}>FT</span>
  return <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', fontWeight: 700 }}>Soon</span>
}

export default function DashboardHomePage() {
  const { publicKey, connected } = useWallet()
  const { squad, squadName } = useSquadStore()
  const [points, setPoints] = useState<Record<string, number>>({})
  const [matches, setMatches] = useState<MatchesResponse | null>(null)
  const [myLeaderboard, setMyLeaderboard] = useState<SquadLiveScore | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.allSettled([
      scoresApi.points(),
      scoresApi.matches(),
      scoresApi.leaderboard(),
    ]).then(([pRes, mRes, lRes]) => {
      if (cancelled) return
      if (pRes.status === 'fulfilled') setPoints(pRes.value)
      if (mRes.status === 'fulfilled') setMatches(mRes.value)
      if (lRes.status === 'fulfilled' && publicKey) {
        const wallet = publicKey.toBase58()
        const entry = lRes.value.find(r => r.walletAddress === wallet) ?? null
        setMyLeaderboard(entry)
      }
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [publicKey])

  const players = [squad.gk, squad.def1, squad.def2, squad.fwd1, squad.fwd2].filter(Boolean) as NonNullable<typeof squad.gk>[]
  const todayPoints = players.reduce((sum, p) => sum + (points[p.id] ?? 0), 0)
  const totalPoints = myLeaderboard?.totalPoints ?? 0
  const squadFilled = filledCount(squad)
  const squadComplete = isComplete(squad)

  const todayFixtures = [
    ...(matches?.live ?? []),
    ...(matches?.today ?? []),
    ...(matches?.finished ?? []),
  ].slice(0, 6)

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '28px 28px 40px', background: '#0a0e1a' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: '22px' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '6px' }}>{today}</p>
        <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 900, letterSpacing: '-0.01em', lineHeight: 1 }}>
          Dashboard
          {connected && publicKey && (
            <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400, fontSize: '14px', marginLeft: '12px', letterSpacing: 0 }}>
              {publicKey.toBase58().slice(0, 4)}…{publicKey.toBase58().slice(-4)}
            </span>
          )}
        </h1>
      </div>

      {/* ── Points Hero: Today + Total side by side ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '14px',
        marginBottom: '18px',
      }}>
        {/* Today's Points */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0,255,135,0.1) 0%, rgba(0,255,135,0.04) 100%)',
          border: '1px solid rgba(0,255,135,0.25)',
          borderRadius: '18px',
          padding: '26px 28px',
        }}>
          <p style={{ color: 'rgba(0,255,135,0.6)', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '12px' }}>
            Today's Points
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', lineHeight: 1 }}>
            <span style={{ color: '#00FF87', fontSize: '60px', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em' }}>
              {loading ? '—' : todayPoints}
            </span>
            <span style={{ color: 'rgba(0,255,135,0.4)', fontSize: '16px', fontWeight: 700, marginBottom: '7px' }}>pts</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontWeight: 500, marginTop: '10px' }}>
            Earned from today's matches
          </p>
        </div>

        {/* Total Points */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '18px',
          padding: '26px 28px',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '12px' }}>
            Total Points
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', lineHeight: 1 }}>
            <span style={{ color: '#fff', fontSize: '60px', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em' }}>
              {loading ? '—' : totalPoints}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '16px', fontWeight: 700, marginBottom: '7px' }}>pts</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontWeight: 500, marginTop: '10px' }}>
            {myLeaderboard ? `Rank #${myLeaderboard.rank} · All time` : 'All time cumulative'}
          </p>
        </div>
      </div>

      {/* ── Mini stats strip ── */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '18px' }}>
        {[
          { label: 'Squad', value: `${squadFilled}/5` },
          { label: 'Live', value: loading ? '—' : String(matches?.live?.length ?? 0) },
          { label: "Today's Matches", value: loading ? '—' : String(matches?.today?.length ?? 0) },
          { label: 'Finished', value: loading ? '—' : String(matches?.finished?.length ?? 0) },
        ].map(({ label, value }) => (
          <div key={label} style={{
            flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px', padding: '14px 16px',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '5px' }}>{label}</p>
            <p style={{ color: '#fff', fontSize: '20px', fontWeight: 900, lineHeight: 1 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>

        {/* ── Squad breakdown ── */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px', padding: '22px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '3px' }}>My Squad</p>
              <p style={{ color: '#fff', fontSize: '15px', fontWeight: 800 }}>{squadName || 'Unnamed Squad'}</p>
            </div>
            {squadComplete && (
              <span style={{ background: 'rgba(0,255,135,0.1)', border: '1px solid rgba(0,255,135,0.2)', color: '#00FF87', fontSize: '10px', fontWeight: 800, padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Complete
              </span>
            )}
          </div>

          {players.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px', marginBottom: '6px' }}>No squad built yet</p>
              <a href="/squad" style={{ color: '#00FF87', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>Build your squad →</a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {players.map((player) => {
                const pts = points[player.id] ?? 0
                return (
                  <div key={player.id} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 12px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <PositionBadge pos={player.position} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#fff', fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontWeight: 500 }}>{player.country}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ color: loading ? 'rgba(255,255,255,0.2)' : pts > 0 ? '#00FF87' : '#fff', fontSize: '16px', fontWeight: 900, lineHeight: 1 }}>
                        {loading ? '—' : pts}
                      </p>
                      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>today</p>
                    </div>
                  </div>
                )
              })}

              {/* Today / Total row */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <div style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderRadius: '10px',
                  background: 'rgba(0,255,135,0.05)', border: '1px solid rgba(0,255,135,0.15)',
                }}>
                  <span style={{ color: '#00FF87', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Today</span>
                  <span style={{ color: '#00FF87', fontSize: '18px', fontWeight: 900 }}>{loading ? '—' : todayPoints}</span>
                </div>
                <div style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total</span>
                  <span style={{ color: '#fff', fontSize: '18px', fontWeight: 900 }}>{loading ? '—' : totalPoints}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Today's matches ── */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px', padding: '22px',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '3px' }}>Today's Matches</p>
          <p style={{ color: '#fff', fontSize: '15px', fontWeight: 800, marginBottom: '18px' }}>
            {loading ? '—' : todayFixtures.length === 0 ? 'No matches today' : `${todayFixtures.length} fixture${todayFixtures.length !== 1 ? 's' : ''}`}
          </p>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: '52px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }} />
              ))}
            </div>
          ) : todayFixtures.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>Check back on match days</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {todayFixtures.map((fixture) => (
                <div key={fixture.fixtureId} style={{
                  padding: '10px 12px', borderRadius: '10px',
                  background: fixture.status === 'live' ? 'rgba(0,255,135,0.04)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${fixture.status === 'live' ? 'rgba(0,255,135,0.15)' : 'rgba(255,255,255,0.05)'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                      {fixture.round}
                    </span>
                    <MatchBadge status={fixture.status} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>{fixture.homeTeam}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 900, padding: '0 10px' }}>
                      {fixture.homeScore !== null && fixture.awayScore !== null
                        ? `${fixture.homeScore} – ${fixture.awayScore}`
                        : 'vs'}
                    </span>
                    <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700, textAlign: 'right' }}>{fixture.awayTeam}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ── Performance summary strip ── */}
      {!loading && players.length > 0 && (
        <div style={{
          marginTop: '18px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px', padding: '20px 22px',
          display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap',
        }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px' }}>Squad Summary</p>
            <p style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>
              {todayPoints === 0
                ? "Waiting for today's matches to begin"
                : `+${todayPoints} pts today · ${totalPoints} pts total`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '24px', marginLeft: 'auto' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#00FF87', fontSize: '18px', fontWeight: 900 }}>{players.reduce((s, p) => s + p.goals, 0)}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Career Goals</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#fff', fontSize: '18px', fontWeight: 900 }}>{players.reduce((s, p) => s + p.caps, 0)}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Caps</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#fff', fontSize: '18px', fontWeight: 900 }}>{new Set(players.map(p => p.country)).size}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Nations</p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
