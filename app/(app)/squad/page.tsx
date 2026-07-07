'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import type { Player, Position, SlotId } from '@/types'
import { useSquadStore, filledCount, isComplete } from '@/store/squadStore'
import players from '@/data/players'
import FlagImg from '@/components/FlagImg'
import Pitch from '@/components/Pitch'
import PlayerModal from '@/components/PlayerModal'

const slotPosition: Record<SlotId, Position> = {
  gk: 'GK', def1: 'DEF', def2: 'DEF', fwd1: 'FWD', fwd2: 'FWD',
}

const posBadge: Record<Position, { bg: string; color: string }> = {
  GK:  { bg: 'rgba(234,179,8,0.15)',  color: '#facc15' },
  DEF: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  FWD: { bg: 'rgba(239,68,68,0.15)',  color: '#f87171' },
}

export default function SquadBuilderPage() {
  const { connected } = useWallet()
  const router = useRouter()
  const { squad, selectedSlot, setPlayer, setSelectedSlot } = useSquadStore()
  const [search, setSearch] = useState('')
  const [posFilter, setPosFilter] = useState<Position | 'ALL'>('ALL')
  const [modalPlayer, setModalPlayer] = useState<Player | null>(null)

  const activePosition: Position | null = selectedSlot ? slotPosition[selectedSlot] : null

  const filtered = useMemo(() => {
    const usedIds = new Set(Object.values(squad).filter(Boolean).map((p) => p!.id))
    const pos = posFilter !== 'ALL' ? posFilter : activePosition
    return players.filter((p) => {
      if (usedIds.has(p.id)) return false
      if (pos && p.position !== pos) return false
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
          !p.country.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search, posFilter, activePosition, squad])

  if (!connected) { router.push('/'); return null }

  function handleSlotClick(slot: SlotId) {
    setSelectedSlot(selectedSlot === slot ? null : slot)
    setPosFilter('ALL')
  }

  function handleAddPlayer(player: Player) {
    if (!selectedSlot) return
    setPlayer(selectedSlot, player)
    setModalPlayer(null)
  }

  const count = filledCount(squad)
  const complete = isComplete(squad)

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ minHeight: 0, background: '#0a0e1a' }}>

      <div
        className="builder-header-row"
        style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0, background: 'rgba(255,255,255,0.02)' }}
      >
        <div>
          <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>
            Build Your Squad
          </h2>
          {selectedSlot
            ? <p style={{ color: '#00FF87', fontSize: '11px', fontWeight: 700, marginTop: '2px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Selecting {slotPosition[selectedSlot]} — pick from the list →
              </p>
            : <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '2px', letterSpacing: '0.05em' }}>
                World Cup 2026 · 5-a-side · Tap a slot on the pitch
              </p>
          }
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: i < count ? '22px' : '8px',
                  height: '8px', borderRadius: '4px',
                  background: i < count ? '#00FF87' : 'rgba(255,255,255,0.12)',
                  transition: 'all 0.25s ease',
                }}
              />
            ))}
          </div>
          <span style={{ color: complete ? '#00FF87' : 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 900, marginLeft: '4px' }}>
            {count}/5
          </span>
        </div>

        {complete ? (
          <button
            onClick={() => router.push('/my-squad')}
            style={{ background: '#00FF87', color: '#0a0e1a', padding: '8px 20px', borderRadius: '8px', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#00e07a')}
            onMouseLeave={e => (e.currentTarget.style.background = '#00FF87')}
          >
            Save Squad →
          </button>
        ) : (
          <div style={{ width: '110px' }} />
        )}
      </div>

      <div className="split-view">

        <div className="split-pitch-col">
          <div className="flex-1 min-h-0">
            <Pitch squad={squad} selectedSlot={selectedSlot} onSlotClick={handleSlotClick} />
          </div>
        </div>

        <div className="split-list-col">

          <div className="builder-list-header" style={{ padding: '14px 20px 0', flexShrink: 0 }}>

            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <svg
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'rgba(255,255,255,0.7)', pointerEvents: 'none' }}
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search player or country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '9px 12px 9px 36px', color: '#fff', fontSize: '13px', outline: 'none' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,255,135,0.35)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              {(['ALL', 'GK', 'DEF', 'FWD'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setPosFilter(pos)}
                  style={{ flex: 1, padding: '7px 0', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' as const, letterSpacing: '0.08em', background: posFilter === pos ? '#00FF87' : 'rgba(255,255,255,0.06)', color: posFilter === pos ? '#0a0e1a' : 'rgba(255,255,255,0.7)', transition: 'all 0.15s' }}
                >
                  {pos}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)' }}>
              <span style={{ flex: 1, paddingLeft: '4px' }}>Player</span>
              <span style={{ width: '48px', textAlign: 'center' }}>Pos</span>
              <span style={{ width: '32px' }} />
            </div>
          </div>

          <div className="builder-list-scroll">
            {filtered.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px' }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>No players found</p>
              </div>
            ) : filtered.map((player, idx) => {
              const badge = posBadge[player.position]
              const canQuickAdd = !!(selectedSlot && slotPosition[selectedSlot] === player.position)
              return (
                <div
                  key={player.id}
                  onClick={() => setModalPlayer(player)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)', background: idx % 2 !== 0 ? 'rgba(255,255,255,0.015)' : 'transparent', transition: 'background 0.12s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,255,135,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = idx % 2 !== 0 ? 'rgba(255,255,255,0.015)' : 'transparent')}
                >
                  <FlagImg country={player.country} size={22} shape="rect" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: '13px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', margin: '1px 0 0' }}>{player.country}</p>
                  </div>
                  <span style={{ background: badge.bg, color: badge.color, padding: '2px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase' as const, flexShrink: 0, width: '42px', textAlign: 'center' as const }}>
                    {player.position}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (canQuickAdd) handleAddPlayer(player); else setModalPlayer(player) }}
                    style={{ width: '26px', height: '26px', borderRadius: '50%', border: 'none', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 900, lineHeight: 1, background: canQuickAdd ? '#00FF87' : 'rgba(255,255,255,0.08)', color: canQuickAdd ? '#0a0e1a' : 'rgba(255,255,255,0.7)', transition: 'all 0.15s' }}
                  >
                    +
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {modalPlayer && (
        <PlayerModal
          player={modalPlayer}
          targetSlot={selectedSlot}
          onAdd={handleAddPlayer}
          onClose={() => setModalPlayer(null)}
        />
      )}
    </div>
  )
}
