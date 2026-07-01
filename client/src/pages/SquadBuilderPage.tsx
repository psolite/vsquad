import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import type { Player, Position, SlotId } from '../types'
import { useSquadStore, filledCount, isComplete } from '../store/squadStore'
import players from '../data/players'
import Pitch from '../components/Pitch'
import PlayerModal from '../components/PlayerModal'

const slotPosition: Record<SlotId, Position> = {
  gk: 'GK', def1: 'DEF', def2: 'DEF', fwd1: 'FWD', fwd2: 'FWD',
}

export default function SquadBuilderPage() {
  const { connected } = useWallet()
  const navigate = useNavigate()

  const { squad, selectedSlot, setPlayer, setSelectedSlot } = useSquadStore()

  const [search, setSearch] = useState('')
  const [posFilter, setPosFilter] = useState<Position | 'ALL'>('ALL')
  const [modalPlayer, setModalPlayer] = useState<Player | null>(null)

  if (!connected) {
    navigate('/')
    return null
  }

  const activePosition: Position | null = selectedSlot ? slotPosition[selectedSlot] : null
  const usedIds = new Set(Object.values(squad).filter(Boolean).map((p) => p!.id))

  const filtered = useMemo(() => {
    const pos = posFilter !== 'ALL' ? posFilter : activePosition
    return players.filter((p) => {
      if (usedIds.has(p.id)) return false
      if (pos && p.position !== pos) return false
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
          !p.country.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search, posFilter, activePosition, usedIds])

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
    <div className="flex-1 flex flex-col">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 min-h-0">

        {/* LEFT — Pitch */}
        <div className="flex flex-col p-6 border-r border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-black uppercase tracking-widest text-sm">
              Build Your Squad
            </h2>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${complete ? 'bg-[#00FF87]/20 text-[#00FF87]' : 'bg-white/10 text-white/50'}`}>
              {count} / 5
            </span>
          </div>

          <Pitch squad={squad} selectedSlot={selectedSlot} onSlotClick={handleSlotClick} />

          {selectedSlot && (
            <p className="mt-3 text-center text-[#00FF87] text-xs font-bold uppercase tracking-widest animate-pulse">
              Selecting {slotPosition[selectedSlot]} → pick from the list
            </p>
          )}

          {complete && (
            <button
              onClick={() => navigate('/my-squad')}
              className="mt-4 py-3 rounded-xl bg-[#00FF87] text-[#0a0e1a] font-black uppercase tracking-widest hover:bg-[#00cc6e] transition-colors"
            >
              Save Squad →
            </button>
          )}
        </div>

        {/* RIGHT — Player List */}
        <div className="flex flex-col p-6">
          <h2 className="text-white font-black uppercase tracking-widest text-sm mb-4">Players</h2>

          {/* Search */}
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
            <input
              type="text"
              placeholder="Search player or country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#00FF87]/50"
            />
          </div>

          {/* Position Filter */}
          <div className="flex gap-2 mb-4">
            {(['ALL', 'GK', 'DEF', 'FWD'] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => setPosFilter(pos)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                  posFilter === pos
                    ? 'bg-[#00FF87] text-[#0a0e1a]'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>

          {/* Player rows */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1" style={{ maxHeight: '420px' }}>
            {filtered.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-8">No players found</p>
            ) : (
              filtered.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#00FF87]/30 hover:bg-[#00FF87]/5 cursor-pointer transition-all group"
                  onClick={() => setModalPlayer(player)}
                >
                  <span className="text-2xl">{player.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate">{player.name}</p>
                    <p className="text-white/40 text-xs">{player.country}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    player.position === 'GK' ? 'bg-yellow-500/20 text-yellow-400' :
                    player.position === 'DEF' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {player.position}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (selectedSlot && slotPosition[selectedSlot] === player.position) {
                        handleAddPlayer(player)
                      } else {
                        setModalPlayer(player)
                      }
                    }}
                    className="w-7 h-7 rounded-full bg-white/10 text-white/50 text-sm hover:bg-[#00FF87] hover:text-[#0a0e1a] transition-colors flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Player Modal */}
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
