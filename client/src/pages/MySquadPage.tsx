import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { useSquadStore, isComplete } from '../store/squadStore'
import type { SlotId } from '../types'
import Pitch from '../components/Pitch'
import FlagImg from '../components/FlagImg'
import { squadApi } from '../api/squadApi'

const posBg:    Record<string, string> = { GK: 'rgba(234,179,8,0.15)',  DEF: 'rgba(59,130,246,0.15)', FWD: 'rgba(239,68,68,0.15)' }
const posColor: Record<string, string> = { GK: '#facc15',               DEF: '#60a5fa',               FWD: '#f87171' }

export default function MySquadPage() {
  // ── All hooks must be declared before any early returns ──────────────────
  const { connected, publicKey } = useWallet()
  const navigate = useNavigate()
  const { squad, squadName, locked, setSquadName, lockSquad, resetSquad } = useSquadStore()

  const [saving,      setSaving]      = useState(false)
  const [saveError,   setSaveError]   = useState<string | null>(null)
  const [saved,       setSaved]       = useState(false)
  const [showPickModal, setShowPickModal] = useState(false)

  const wallet    = publicKey?.toBase58() ?? ''
  const complete  = isComplete(squad)

  // Auto-save to backend on first load (once squad is complete)
  useEffect(() => {
    if (!complete || !wallet) return
    setSaving(true)
    setSaveError(null)
    squadApi.save(wallet, squadName, squad, locked)
      .then(() => setSaved(true))
      .catch((err: unknown) => setSaveError(err instanceof Error ? err.message : 'Save failed'))
      .finally(() => setSaving(false))
  // Run once on mount — squad won't change while on this page
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Guards (after all hooks) ─────────────────────────────────────────────
  if (!connected) { navigate('/'); return null }
  if (!complete)  { navigate('/squad'); return null }

  // ── Handlers ────────────────────────────────────────────────────────────
  async function handleLock() {
    if (!wallet) return
    lockSquad()          // update UI immediately
    setSaving(true)
    setSaveError(null)
    try {
      await squadApi.save(wallet, squadName, squad, true)
      setSaved(true)
      toast.success('Squad locked in!')
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  function handleEdit() {
    setShowPickModal(false)
    navigate('/squad')
  }

  async function handleDeleteAndNew() {
    setShowPickModal(false)
    if (wallet) {
      try { await squadApi.delete(wallet) } catch { /* not yet saved — fine */ }
    }
    resetSquad()
    toast('Squad cleared', { icon: '🗑️' })
    navigate('/squad')
  }

  const noop       = (_slot: SlotId) => {}
  const totalGoals = Object.values(squad).reduce((s, p) => s + (p?.goals ?? 0), 0)
  const totalCaps  = Object.values(squad).reduce((s, p) => s + (p?.caps  ?? 0), 0)

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ minHeight: 0, background: '#0a0e1a' }}>

      {/* ── Top bar ─────────────────────────────────── */}
      <div style={{
        padding: '12px 24px', flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(255,255,255,0.02)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>
            My Squad
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '2px', letterSpacing: '0.05em' }}>
            World Cup 2026 · 5-a-side
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {saveError && <span style={{ color: '#f87171', fontSize: '11px' }}>{saveError}</span>}
          {saving    && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>Saving…</span>}
          {saved && !saving && !saveError && <span style={{ color: 'rgba(0,255,135,0.6)', fontSize: '11px' }}>Saved</span>}

          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: locked ? '#00FF87' : '#facc15', boxShadow: locked ? '0 0 6px #00FF87' : '0 0 6px #facc15' }} />
            <span style={{ color: locked ? '#00FF87' : '#facc15', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {locked ? 'Locked' : 'Draft'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main columns ────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>

        {/* LEFT — Pitch (read-only) */}
        <div className="flex flex-col" style={{ width: '42%', borderRight: '1px solid rgba(255,255,255,0.07)', padding: '16px', minHeight: 0 }}>
          <div className="flex-1 min-h-0">
            <Pitch squad={squad} selectedSlot={null} onSlotClick={noop} />
          </div>
        </div>

        {/* RIGHT — Details */}
        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Squad name */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.35)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Squad Name
            </label>
            {!locked ? (
              <input
                type="text"
                placeholder="My Dream Squad..."
                value={squadName}
                onChange={(e) => setSquadName(e.target.value)}
                maxLength={30}
                style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '15px', fontWeight: 700, outline: 'none' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,255,135,0.4)')}
                onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            ) : (
              <p style={{ color: '#00FF87', fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                {squadName || '—'}
              </p>
            )}
          </div>

          {/* Player rows */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.35)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Players
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(['gk', 'def1', 'def2', 'fwd1', 'fwd2'] as SlotId[]).map((id) => {
                const p = squad[id]
                if (!p) return null
                return (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '10px 14px' }}>
                    <FlagImg country={p.country} size={24} shape="rect" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#fff', fontWeight: 700, fontSize: '13px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', margin: '2px 0 0' }}>{p.country}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px', flexShrink: 0 }}>
                      <span style={{ background: posBg[p.position], color: posColor[p.position], padding: '2px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        {p.position}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px' }}>
                        {p.goals}G · {p.caps} caps
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[{ value: totalGoals, label: 'Total Goals' }, { value: totalCaps, label: 'Total Caps' }].map(({ value, label }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                <div style={{ color: '#00FF87', fontSize: '26px', fontWeight: 900, lineHeight: 1 }}>{value}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '5px' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          {!locked ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowPickModal(true)}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
              >
                Change Squad
              </button>
              <button
                onClick={handleLock}
                disabled={saving}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: saving ? 'rgba(0,255,135,0.5)' : '#00FF87', color: '#0a0e1a', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: saving ? 'default' : 'pointer' }}
                onMouseEnter={e => { if (!saving) e.currentTarget.style.background = '#00e07a' }}
                onMouseLeave={e => { if (!saving) e.currentTarget.style.background = '#00FF87' }}
              >
                {saving ? 'Saving…' : 'Lock In'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowPickModal(true)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
            >
              Pick a New Squad
            </button>
          )}

        </div>
      </div>

      {/* ── Pick / Edit modal ──────────────────────── */}
      {showPickModal && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => setShowPickModal(false)}
        >
          {/* Backdrop */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} />

          {/* Card */}
          <div
            style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '380px', background: '#0f1923', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '28px 24px 24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setShowPickModal(false)}
              style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(255,255,255,0.07)', border: 'none', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', color: 'rgba(255,255,255,0.45)', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>

            {/* Title */}
            <h3 style={{ color: '#fff', fontWeight: 900, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>
              What would you like to do?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', margin: '0 0 24px', lineHeight: 1.5 }}>
              Edit your current squad or wipe it and start fresh.
            </p>

            {/* Option 1 — Edit */}
            <button
              onClick={handleEdit}
              style={{ width: '100%', padding: '14px 16px', marginBottom: '10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '14px', transition: 'border-color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,255,135,0.35)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(0,255,135,0.1)', border: '1px solid rgba(0,255,135,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00FF87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: 800, fontSize: '13px', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Edit Squad</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', margin: 0 }}>Swap or change players in your current squad</p>
              </div>
            </button>

            {/* Option 2 — Delete & new */}
            <button
              onClick={handleDeleteAndNew}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '14px', transition: 'border-color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(239,68,68,0.45)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </div>
              <div>
                <p style={{ color: '#f87171', fontWeight: 800, fontSize: '13px', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Delete & Select New</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', margin: 0 }}>Remove your squad and pick 5 new players</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
