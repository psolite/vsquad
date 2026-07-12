'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAccountId } from '@/lib/useAccountId'
import type { Player, Position, SlotId } from '@/types'
import { useSquadStore, filledCount, isComplete } from '@/store/squadStore'
import players from '@/data/players'
import { activeCountries } from '@/data/active'
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
  const { id: accountId, ready: accountReady } = useAccountId()
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
      if (activeCountries.size > 0 && !activeCountries.has(p.country)) return false
      if (pos && p.position !== pos) return false
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
          !p.country.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search, posFilter, activePosition, squad])

  if (accountReady && !accountId) { router.push('/'); return null }

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
    <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-bg">

      <div className="flex items-center justify-between flex-wrap gap-2.5 py-3 px-6 border-b border-white/7 shrink-0 bg-white/2">
        <div>
          <h2 className="text-white font-black text-[13px] uppercase tracking-[0.12em] m-0">
            Build Your Squad
          </h2>
          {selectedSlot
            ? <p className="text-accent text-[11px] font-bold mt-0.5 tracking-[0.08em] uppercase">
                Selecting {slotPosition[selectedSlot]} — pick from the list →
              </p>
            : <p className="text-white/70 text-[11px] mt-0.5 tracking-wider">
                World Cup 2026 · 5-a-side · Tap a slot on the pitch
              </p>
          }
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`${i < count ? 'w-5.5' : 'w-2'} h-2 rounded transition-all duration-250 ${i < count ? 'bg-accent' : 'bg-white/12'}`}
              />
            ))}
          </div>
          <span className={`text-xs font-black ml-1 ${complete ? 'text-accent' : 'text-white/70'}`}>
            {count}/5
          </span>
        </div>

        {complete ? (
          <button
            onClick={() => router.push('/my-squad')}
            className="bg-accent hover:bg-accent-hover text-bg py-2 px-5 rounded-lg font-black text-xs uppercase tracking-widest border-none cursor-pointer transition-colors"
          >
            Save Squad →
          </button>
        ) : (
          <div className="w-27.5" />
        )}
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0 max-[860px]:flex-col max-[860px]:overflow-y-auto">

        <div className="w-[42%] shrink-0 border-r border-white/7 p-4 min-h-0 flex flex-col max-[860px]:w-full max-[860px]:h-95 max-[860px]:flex-none max-[860px]:border-r-0 max-[860px]:border-b">
          <div className="flex-1 min-h-0">
            <Pitch squad={squad} selectedSlot={selectedSlot} onSlotClick={handleSlotClick} />
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden min-h-0 max-[860px]:flex-none max-[860px]:h-auto max-[860px]:overflow-visible">

          <div className="sticky top-0 z-5 bg-bg pt-3.5 px-5">

            <div className="relative mb-2.5">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.75 h-3.75 text-white/70 pointer-events-none"
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search player or country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full box-border bg-white/5 border border-white/8 focus:border-accent/35 rounded-[10px] py-2.25 pr-3 pl-9 text-white text-[13px] outline-none"
              />
            </div>

            <div className="flex gap-2 mb-3">
              {(['ALL', 'GK', 'DEF', 'FWD'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setPosFilter(pos)}
                  className={`flex-1 py-1.75 rounded-lg border-none cursor-pointer text-[11px] font-black uppercase tracking-[0.08em] transition-all duration-150 ${
                    posFilter === pos ? 'bg-accent text-bg' : 'bg-white/6 text-white/70'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>

            <div className="flex items-center pb-2 px-1 border-b border-white/6 text-[10px] font-bold uppercase tracking-widest text-white/70">
              <span className="flex-1 pl-1">Player</span>
              <span className="w-12 text-center">Pos</span>
              <span className="w-8" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 max-[860px]:flex-none max-[860px]:h-auto max-[860px]:overflow-visible">
            {filtered.length === 0 ? (
              <div className="flex items-center justify-center h-30">
                <p className="text-white/70 text-[13px]">No players found</p>
              </div>
            ) : filtered.map((player, idx) => {
              const badge = posBadge[player.position]
              const canQuickAdd = !!(selectedSlot && slotPosition[selectedSlot] === player.position)
              return (
                <div
                  key={player.id}
                  onClick={() => setModalPlayer(player)}
                  className={`flex items-center gap-3 py-2.5 px-5 cursor-pointer border-b border-white/4 transition-colors hover:bg-accent/5 ${idx % 2 !== 0 ? 'bg-white/1.5' : 'bg-transparent'}`}
                >
                  <FlagImg country={player.country} size={22} shape="rect" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-[13px] m-0 whitespace-nowrap overflow-hidden text-ellipsis">{player.name}</p>
                    <p className="text-white/70 text-[11px] mt-px mb-0">{player.country}</p>
                  </div>
                  <span
                    className="py-0.5 px-2 rounded-[5px] text-[10px] font-black tracking-[0.06em] uppercase shrink-0 w-10.5 text-center"
                    style={{ background: badge.bg, color: badge.color }}
                  >
                    {player.position}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (canQuickAdd) handleAddPlayer(player); else setModalPlayer(player) }}
                    className={`w-6.5 h-6.5 rounded-full border-none cursor-pointer shrink-0 flex items-center justify-center text-base font-black leading-none transition-all duration-150 ${
                      canQuickAdd ? 'bg-accent text-bg' : 'bg-white/8 text-white/70'
                    }`}
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
