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
      <div className="relative z-10 w-full max-w-sm" style={{ background: '#0f1923', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px 24px 24px' }} onClick={(e) => e.stopPropagation()}>

        <button onClick={onClose} style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(255,255,255,0.07)', border: 'none', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', color: 'rgba(255,255,255,0.45)', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', border: `3px solid ${colors.secondary === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : colors.secondary}`, overflow: 'hidden', margin: '0 auto 16px', boxShadow: `0 0 24px ${colors.primary}55`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FlagImg country={player.country} size={72} shape="circle" />
          </div>
          <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '18px', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>{player.name}</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', margin: 0 }}>{positionLabel[player.position]} · {player.country}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          {[{ value: player.goals, label: "Int'l Goals" }, { value: player.caps, label: 'Caps' }].map(({ value, label }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '14px 12px', textAlign: 'center' }}>
              <div style={{ color: '#00FF87', fontSize: '26px', fontWeight: 900, lineHeight: 1 }}>{value}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '6px' }}>{label}</div>
            </div>
          ))}
        </div>

        {canAdd ? (
          <button onClick={() => onAdd(player)} style={{ width: '100%', padding: '13px', background: '#00FF87', color: '#0a0e1a', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em' }} onMouseEnter={e => (e.currentTarget.style.background = '#00e07a')} onMouseLeave={e => (e.currentTarget.style.background = '#00FF87')}>
            + Add to Squad
          </button>
        ) : (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '13px' }}>Select a slot on the pitch first</p>
        )}
      </div>
    </div>
  )
}
