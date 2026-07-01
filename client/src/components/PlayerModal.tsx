import type { Player, SlotId } from '../types'

interface Props {
  player: Player
  targetSlot: SlotId | null
  onAdd: (player: Player) => void
  onClose: () => void
}

const positionLabel: Record<string, string> = { GK: 'Goalkeeper', DEF: 'Defender', FWD: 'Forward' }

export default function PlayerModal({ player, targetSlot, onAdd, onClose }: Props) {
  const canAdd = targetSlot !== null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative bg-[#111827] border border-white/10 rounded-2xl p-6 w-full max-w-sm z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white text-lg">✕</button>

        {/* Flag + Name */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">{player.flag}</div>
          <h2 className="text-xl font-black uppercase tracking-wider text-white">{player.name}</h2>
          <p className="text-white/50 text-sm mt-1">{positionLabel[player.position]} · {player.country}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-[#00FF87]">{player.goals}</div>
            <div className="text-white/40 text-xs uppercase tracking-wider mt-1">Int'l Goals</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-2xl font-black text-[#00FF87]">{player.caps}</div>
            <div className="text-white/40 text-xs uppercase tracking-wider mt-1">Caps</div>
          </div>
        </div>

        {/* CTA */}
        {canAdd ? (
          <button
            onClick={() => onAdd(player)}
            className="w-full py-3 rounded-xl bg-[#00FF87] text-[#0a0e1a] font-black uppercase tracking-widest hover:bg-[#00cc6e] transition-colors"
          >
            + Add to Squad
          </button>
        ) : (
          <p className="text-center text-white/30 text-sm">Select a slot on the pitch first</p>
        )}
      </div>
    </div>
  )
}
