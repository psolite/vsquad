import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useSquadStore, isComplete } from '../store/squadStore'
import { tournamentApi, type Tournament, type CreateTournamentInput } from '../api/tournamentApi'

const STATUS_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  open:   { label: 'Open',  bg: 'rgba(0,255,135,0.12)',   color: '#00FF87' },
  active: { label: 'Live',  bg: 'rgba(250,204,21,0.12)',  color: '#facc15' },
  ended:  { label: 'Ended', bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' },
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
function shortWallet(addr: string) { return `${addr.slice(0, 4)}…${addr.slice(-4)}` }

const EMPTY_FORM: CreateTournamentInput = {
  name: '', description: '', prize: '', status: 'open',
  startDate: '', endDate: '', maxParticipants: 500,
}

function InputRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
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

export default function TournamentPage() {
  const { connected, publicKey } = useWallet()
  const { squad } = useSquadStore()

  const [tournaments,   setTournaments]   = useState<Tournament[]>([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState<string | null>(null)
  const [busy,          setBusy]          = useState<string | null>(null)
  const [showCreate,    setShowCreate]    = useState(false)
  const [form,          setForm]          = useState<CreateTournamentInput>(EMPTY_FORM)
  const [creating,      setCreating]      = useState(false)
  const [createError,   setCreateError]   = useState<string | null>(null)

  const wallet   = publicKey?.toBase58() ?? ''
  const hasSquad = isComplete(squad)

  useEffect(() => {
    tournamentApi.list()
      .then(setTournaments)
      .catch(() => setError('Could not load tournaments. Is the server running?'))
      .finally(() => setLoading(false))
  }, [])

  function field(key: keyof CreateTournamentInput, value: string | number) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleCreate() {
    if (!form.name.trim() || !form.startDate || !form.endDate) {
      setCreateError('Name, start date and end date are required.')
      return
    }
    setCreating(true)
    setCreateError(null)
    try {
      const created = await tournamentApi.create(form)
      setTournaments((prev) => [created, ...prev])
      setShowCreate(false)
      setForm(EMPTY_FORM)
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create')
    } finally {
      setCreating(false)
    }
  }

  async function handleJoin(id: string) {
    if (!wallet) return
    setBusy(id)
    try {
      const updated = await tournamentApi.join(id, wallet)
      setTournaments((prev) => prev.map((t) => (t.id === id ? updated : t)))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to join')
    } finally { setBusy(null) }
  }

  async function handleLeave(id: string) {
    if (!wallet) return
    setBusy(id)
    try {
      await tournamentApi.leave(id, wallet)
      setTournaments((prev) =>
        prev.map((t) => t.id === id ? { ...t, participants: t.participants.filter((w) => w !== wallet) } : t)
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to leave')
    } finally { setBusy(null) }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ minHeight: 0, background: '#0a0e1a' }}>

      {/* ── Top bar ───────────────────────────────── */}
      <div style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0, background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>Tournaments</h2>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '2px', letterSpacing: '0.05em' }}>FIFA World Cup 2026 · Join or create a league</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00FF87', boxShadow: '0 0 6px #00FF87' }} />
            <span style={{ color: '#00FF87', fontSize: '11px', fontWeight: 700 }}>{tournaments.length} Leagues</span>
          </div>
          {connected && (
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
      </div>

      {/* ── Body ─────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto" style={{ minHeight: 0, padding: '20px 24px' }}>

        {/* Info banners */}
        {!connected && (
          <div style={{ background: 'rgba(250,204,21,0.06)', border: '1px solid rgba(250,204,21,0.15)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p style={{ color: '#facc15', fontSize: '12px', fontWeight: 600, margin: 0 }}>Connect your wallet to join or create a tournament</p>
          </div>
        )}
        {connected && !hasSquad && (
          <div style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p style={{ color: '#60a5fa', fontSize: '12px', fontWeight: 600, margin: 0 }}>Build and save your squad first to join tournaments</p>
          </div>
        )}

        {loading && <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', textAlign: 'center', marginTop: '60px' }}>Loading tournaments…</p>}
        {error   && <p style={{ color: '#f87171', fontSize: '13px', textAlign: 'center', marginTop: '60px' }}>{error}</p>}

        {/* Cards */}
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
                      <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>{t.description}</p>
                    </div>

                    {isJoined ? (
                      <button onClick={() => handleLeave(t.id)} disabled={isBusy}
                        style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: isBusy ? 'default' : 'pointer', flexShrink: 0 }}
                        onMouseEnter={e => { if (!isBusy) { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.color = '#f87171' } }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
                      >{isBusy ? '…' : 'Leave'}</button>
                    ) : (
                      <button onClick={() => canAct && handleJoin(t.id)} disabled={!canAct || isBusy}
                        style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: canAct ? '#00FF87' : 'rgba(255,255,255,0.07)', color: canAct ? '#0a0e1a' : 'rgba(255,255,255,0.2)', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: canAct && !isBusy ? 'pointer' : 'default', flexShrink: 0 }}
                        onMouseEnter={e => { if (canAct && !isBusy) e.currentTarget.style.background = '#00e07a' }}
                        onMouseLeave={e => { if (canAct && !isBusy) e.currentTarget.style.background = '#00FF87' }}
                      >{isBusy ? '…' : 'Join'}</button>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
                    {t.prize && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>Prize: {t.prize}</span>}
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>{fmt(t.startDate)} – {fmt(t.endDate)}</span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Participants</span>
                      <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: '10px', fontWeight: 700 }}>{t.participants.length.toLocaleString()} / {t.maxParticipants.toLocaleString()}</span>
                    </div>
                    <div style={{ height: '3px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: '#00FF87', borderRadius: '2px' }} />
                    </div>
                    {t.participants.length > 0 && (
                      <div style={{ display: 'flex', gap: '5px', marginTop: '7px', flexWrap: 'wrap' }}>
                        {t.participants.slice(0, 6).map((addr) => (
                          <span key={addr} style={{ background: addr === wallet ? 'rgba(0,255,135,0.12)' : 'rgba(255,255,255,0.05)', color: addr === wallet ? '#00FF87' : 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>
                            {shortWallet(addr)}
                          </span>
                        ))}
                        {t.participants.length > 6 && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', padding: '2px 0' }}>+{t.participants.length - 6} more</span>}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Create Tournament Modal ───────────────── */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setShowCreate(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} />

          <div
            style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '460px', background: '#0f1923', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '28px 24px 24px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button onClick={() => setShowCreate(false)} style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(255,255,255,0.07)', border: 'none', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', color: 'rgba(255,255,255,0.45)', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>

            <h3 style={{ color: '#fff', fontWeight: 900, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Create Tournament</h3>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', margin: '0 0 22px' }}>Set up your own league for World Cup 2026</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              <InputRow label="Tournament Name *">
                <input value={form.name} onChange={e => field('name', e.target.value)} placeholder="e.g. Friday Night Fantasy" maxLength={60} style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,255,135,0.4)')}
                  onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </InputRow>

              <InputRow label="Description *">
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <InputRow label="Max Participants">
                  <input type="number" min={2} max={100000} value={form.maxParticipants} onChange={e => field('maxParticipants', Number(e.target.value))} style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,255,135,0.4)')}
                    onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')} />
                </InputRow>
                <InputRow label="Status">
                  <select value={form.status} onChange={e => field('status', e.target.value as 'open' | 'active')}
                    style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="open">Open</option>
                    <option value="active">Active / Live</option>
                  </select>
                </InputRow>
              </div>

              {createError && <p style={{ color: '#f87171', fontSize: '12px', margin: 0 }}>{createError}</p>}

              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button onClick={() => setShowCreate(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={handleCreate} disabled={creating}
                  style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: creating ? 'rgba(0,255,135,0.5)' : '#00FF87', color: '#0a0e1a', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', cursor: creating ? 'default' : 'pointer' }}
                  onMouseEnter={e => { if (!creating) e.currentTarget.style.background = '#00e07a' }}
                  onMouseLeave={e => { if (!creating) e.currentTarget.style.background = '#00FF87' }}>
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
