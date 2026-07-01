import { useNavigate } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { useSquadStore, isComplete } from '../store/squadStore'
import type { SlotId } from '../types'
import Pitch from '../components/Pitch'

export default function MySquadPage() {
  const { connected } = useWallet()
  const navigate = useNavigate()
  const { squad, squadName, locked, setSquadName, lockSquad, resetSquad } = useSquadStore()

  if (!connected) { navigate('/'); return null }
  if (!isComplete(squad)) { navigate('/squad'); return null }

  // Pitch is read-only on this page — slot clicks do nothing
  const noop = (_slot: SlotId) => {}

  return (
    <div className="flex-1 flex items-start justify-center p-6 gap-8 flex-wrap">

      {/* Pitch (read-only) */}
      <div style={{ width: '280px', flexShrink: 0 }}>
        <Pitch squad={squad} selectedSlot={null} onSlotClick={noop} />
      </div>

      {/* Panel */}
      <div className="flex flex-col gap-6" style={{ minWidth: '240px', maxWidth: '340px', flex: 1 }}>

        {/* Header */}
        <div>
          <div className="text-3xl mb-1">{locked ? '🔒' : '✅'}</div>
          <h1 className="text-xl font-black uppercase tracking-widest text-white">
            {locked ? 'Squad Locked' : 'Squad Ready'}
          </h1>
          <p className="text-white/40 text-sm mt-1">World Cup 2026 · 5-a-side</p>
        </div>

        {/* Squad name */}
        {!locked ? (
          <div>
            <label className="block text-white/50 text-xs uppercase tracking-widest mb-2">Squad Name</label>
            <input
              type="text"
              placeholder="My Dream Squad..."
              value={squadName}
              onChange={(e) => setSquadName(e.target.value)}
              maxLength={30}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-[#00FF87]/50 font-bold"
            />
          </div>
        ) : squadName ? (
          <p className="text-[#00FF87] font-black text-xl uppercase tracking-widest">"{squadName}"</p>
        ) : null}

        {/* Player list summary */}
        <div className="space-y-2">
          {(['gk', 'def1', 'def2', 'fwd1', 'fwd2'] as SlotId[]).map((id) => {
            const p = squad[id]
            if (!p) return null
            return (
              <div key={id} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2.5">
                <span className="text-2xl">{p.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">{p.name}</p>
                  <p className="text-white/40 text-xs">{p.country}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  p.position === 'GK' ? 'bg-yellow-500/20 text-yellow-400' :
                  p.position === 'DEF' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-red-500/20 text-red-400'
                }`}>{p.position}</span>
              </div>
            )
          })}
        </div>

        {/* Actions */}
        {!locked ? (
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/squad')}
              className="flex-1 py-3 rounded-xl border border-white/20 text-white/60 font-bold uppercase tracking-wider text-sm hover:border-white/40 hover:text-white transition-colors"
            >
              Edit
            </button>
            <button
              onClick={lockSquad}
              className="flex-1 py-3 rounded-xl bg-[#00FF87] text-[#0a0e1a] font-black uppercase tracking-widest hover:bg-[#00cc6e] transition-colors"
            >
              Lock In
            </button>
          </div>
        ) : (
          <button
            onClick={() => { resetSquad(); navigate('/squad') }}
            className="w-full py-3 rounded-xl border border-white/20 text-white/60 font-bold uppercase tracking-wider hover:border-white/40 hover:text-white transition-colors"
          >
            Pick a New Squad
          </button>
        )}
      </div>
    </div>
  )
}
