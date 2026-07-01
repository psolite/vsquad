import type { Player, SlotId } from '../types'
import { countryColors, defaultColors } from '../data/countryColors'

interface Props {
  slotId: SlotId
  label: string
  player: Player | null
  isSelected: boolean
  onClick: () => void
  onRemove: () => void
}

function Jersey({ primary, secondary, empty }: { primary: string; secondary: string; empty?: boolean }) {
  return (
    <svg viewBox="0 0 80 70" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Drop shadow filter */}
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Jersey body + sleeves */}
      <path
        d="M27,4 L4,17 L13,35 L25,27 L25,66 L55,66 L55,27 L67,35 L76,17 L53,4 Q48,14 40,16 Q32,14 27,4 Z"
        fill={empty ? '#1e3a22' : primary}
        stroke={empty ? '#2a4a2a' : 'rgba(0,0,0,0.25)'}
        strokeWidth="1"
        filter="url(#shadow)"
        opacity={empty ? 0.55 : 1}
      />

      {/* Collar */}
      <ellipse
        cx="40" cy="14" rx="11" ry="5.5"
        fill={empty ? '#0e2012' : secondary}
        opacity={empty ? 0.4 : 0.75}
      />

      {/* Sleeve cuffs (secondary color band) */}
      {!empty && (
        <>
          <line x1="13" y1="35" x2="25" y2="27" stroke={secondary} strokeWidth="5" strokeLinecap="round" opacity="0.6" />
          <line x1="67" y1="35" x2="55" y2="27" stroke={secondary} strokeWidth="5" strokeLinecap="round" opacity="0.6" />
        </>
      )}
    </svg>
  )
}

export default function PitchSlot({ label, player, isSelected, onClick, onRemove }: Props) {
  const colors = player
    ? (countryColors[player.country] ?? defaultColors)
    : defaultColors

  return (
    <div className="flex flex-col items-center" style={{ width: '76px' }}>

      {/* Jersey + interaction */}
      <div
        className={`
          relative cursor-pointer select-none transition-all duration-150
          ${isSelected ? 'scale-110 drop-shadow-[0_0_10px_rgba(0,255,135,0.9)]' : 'hover:scale-105'}
        `}
        style={{ width: '58px', height: '50px' }}
        onClick={onClick}
      >
        <Jersey primary={colors.primary} secondary={colors.secondary} empty={!player} />

        {/* Plus icon on empty slot */}
        {!player && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-black leading-none ${isSelected ? 'text-[#00FF87]' : 'text-white/40'}`}>+</span>
          </div>
        )}

        {/* Selection ring */}
        {isSelected && (
          <div className="absolute inset-0 rounded ring-2 ring-[#00FF87]/70 animate-pulse pointer-events-none" />
        )}

        {/* Remove button */}
        {player && (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove() }}
            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 hover:bg-red-400 text-white flex items-center justify-center z-10 shadow-md text-[9px] font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Name badge — dark pill, FPL style */}
      <div
        className={`
          mt-1 w-full px-1 py-[3px] rounded-sm text-center transition-colors
          ${player
            ? 'bg-[#0d1b2a] text-white'
            : isSelected
              ? 'bg-[#00FF87]/20 text-[#00FF87]'
              : 'bg-[#0d1b2a]/80 text-white/35'
          }
        `}
      >
        <span className="block text-[10px] font-bold uppercase tracking-wide truncate leading-tight">
          {player ? player.name.split(' ').slice(-1)[0] : label}
        </span>
      </div>

      {/* Country + position tag */}
      {player && (
        <div className="mt-[2px] px-1.5 py-[2px] rounded-sm bg-[#003d18] text-[#00FF87] text-[9px] font-bold flex items-center gap-0.5 leading-none">
          <span>{player.flag}</span>
          <span>{player.position}</span>
        </div>
      )}
    </div>
  )
}
