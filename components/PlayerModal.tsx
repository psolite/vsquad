'use client'
import type { Player, SlotId } from '@/types'
import { countryColors, defaultColors } from '@/data/countryColors'
import FlagImg from './FlagImg'

interface Props {
  player: Player
  targetSlot: SlotId | null
  onAdd: (player: Player) => void
  onClose: () => void
}

const positionLabel: Record<string, string> = { GK: 'Goalkeeper', DEF: 'Defender', FWD: 'Forward' }

export default function PlayerModal({ player, targetSlot, onAdd, onClose }: Props) {
  const canAdd = targetSlot !== null
  const colors = countryColors[player.country] ?? defaultColors

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-sm bg-panel border border-white/8 rounded-[20px] py-7 px-6 pb-6" onClick={(e) => e.stopPropagation()}>

        <button onClick={onClose} className="absolute top-3.5 right-3.5 bg-white/7 border-none cursor-pointer w-8 h-8 rounded-full text-white/70 text-sm font-bold flex items-center justify-center">✕</button>

        <div className="text-center mb-6">
          <div
            className="w-18 h-18 rounded-full overflow-hidden mx-auto mb-4 flex items-center justify-center"
            style={{ border: `3px solid ${colors.secondary === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : colors.secondary}`, boxShadow: `0 0 24px ${colors.primary}55` }}
          >
            <FlagImg country={player.country} size={72} shape="circle" />
          </div>
          <h2 className="text-white font-black text-lg uppercase tracking-[0.06em] mt-0 mb-1.5">{player.name}</h2>
          <p className="text-white/70 text-[13px] m-0">{positionLabel[player.position]} · {player.country}</p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {[{ value: player.goals, label: "Int'l Goals" }, { value: player.caps, label: 'Caps' }].map(({ value, label }) => (
            <div key={label} className="bg-white/5 rounded-xl py-3.5 px-3 text-center">
              <div className="text-accent text-2xl font-black leading-none">{value}</div>
              <div className="text-white/70 text-[10px] uppercase tracking-widest mt-1.5">{label}</div>
            </div>
          ))}
        </div>

        {canAdd ? (
          <button onClick={() => onAdd(player)} className="w-full py-3.25 bg-accent hover:bg-accent-hover text-bg border-none rounded-xl cursor-pointer font-black text-[13px] uppercase tracking-widest transition-colors">
            + Add to Squad
          </button>
        ) : (
          <p className="text-center text-white/70 text-[13px]">Select a slot on the pitch first</p>
        )}
      </div>
    </div>
  )
}
