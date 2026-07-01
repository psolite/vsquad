import type { Squad, SlotId } from '../types'
import PitchSlot from './PitchSlot'
import { useSquadStore } from '../store/squadStore'

interface Props {
  squad: Squad
  selectedSlot: SlotId | null
  onSlotClick: (slot: SlotId) => void
}

export default function Pitch({ squad, selectedSlot, onSlotClick }: Props) {
  const removePlayer = useSquadStore((s) => s.removePlayer)

  return (
    <div className="relative w-full rounded-xl overflow-hidden select-none"
         style={{ aspectRatio: '10/13', background: 'linear-gradient(180deg, #2e7d32 0%, #388e3c 18%, #2e7d32 36%, #388e3c 54%, #2e7d32 72%, #388e3c 90%, #2e7d32 100%)' }}>

      {/* ── Pitch line markings ────────────────────────── */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 130" preserveAspectRatio="xMidYMid slice">
        {/* Outer border */}
        <rect x="3" y="3" width="94" height="124" fill="none" stroke="white" strokeWidth="0.5" opacity="0.55" />

        {/* Top penalty area */}
        <rect x="22" y="3" width="56" height="20" fill="none" stroke="white" strokeWidth="0.4" opacity="0.45" />

        {/* Top 6-yard box */}
        <rect x="35" y="3" width="30" height="8" fill="none" stroke="white" strokeWidth="0.4" opacity="0.45" />

        {/* Penalty spot top */}
        <circle cx="50" cy="16" r="0.9" fill="white" opacity="0.5" />

        {/* Halfway line */}
        <line x1="3" y1="65" x2="97" y2="65" stroke="white" strokeWidth="0.45" opacity="0.55" />

        {/* Centre circle */}
        <circle cx="50" cy="65" r="14" fill="none" stroke="white" strokeWidth="0.4" opacity="0.45" />
        <circle cx="50" cy="65" r="1" fill="white" opacity="0.5" />

        {/* Bottom 6-yard box */}
        <rect x="35" y="119" width="30" height="8" fill="none" stroke="white" strokeWidth="0.4" opacity="0.45" />

        {/* Bottom penalty area */}
        <rect x="22" y="107" width="56" height="20" fill="none" stroke="white" strokeWidth="0.4" opacity="0.45" />

        {/* Penalty spot bottom */}
        <circle cx="50" cy="114" r="0.9" fill="white" opacity="0.5" />

        {/* Corner arcs */}
        <path d="M3,3 a4,4 0 0,1 4,4"   fill="none" stroke="white" strokeWidth="0.4" opacity="0.4" />
        <path d="M97,3 a4,4 0 0,0 -4,4"  fill="none" stroke="white" strokeWidth="0.4" opacity="0.4" />
        <path d="M3,127 a4,4 0 0,0 4,-4" fill="none" stroke="white" strokeWidth="0.4" opacity="0.4" />
        <path d="M97,127 a4,4 0 0,1 -4,-4" fill="none" stroke="white" strokeWidth="0.4" opacity="0.4" />
      </svg>

      {/* ── Goal frame at top ──────────────────────────── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ width: '30%' }}>
        {/* Crossbar */}
        <div className="w-full h-[3px] bg-white/70 rounded-b-sm" />
        {/* Posts */}
        <div className="w-full flex justify-between" style={{ height: '12px' }}>
          <div className="w-[3px] h-full bg-white/70 rounded-b-sm" />
          <div className="w-[3px] h-full bg-white/70 rounded-b-sm" />
        </div>
      </div>

      {/* ── World Cup 2026 branding ────────────────────── */}
      <div className="absolute flex items-center justify-between px-2" style={{ top: '3%', left: '3%', right: '3%' }}>
        <div className="flex flex-col items-center opacity-70">
          <span className="text-white text-[7px] font-black uppercase tracking-widest leading-none">FIFA</span>
          <span className="text-[#00FF87] text-[6px] font-bold uppercase tracking-wider leading-none mt-0.5">World Cup 2026</span>
        </div>
        <div className="flex flex-col items-center opacity-70">
          <span className="text-white text-[7px] font-black uppercase tracking-widest leading-none">FIFA</span>
          <span className="text-[#00FF87] text-[6px] font-bold uppercase tracking-wider leading-none mt-0.5">World Cup 2026</span>
        </div>
      </div>

      {/* ── Player slots ──────────────────────────────────
          Layout (top→bottom): GK · DEF DEF · FWD FWD
          Positions are % of pitch height from top         */}

      {/* GK — 13% from top, horizontally centred */}
      <div className="absolute" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)' }}>
        <PitchSlot slotId="gk" label="GK" player={squad.gk}
          isSelected={selectedSlot === 'gk'}
          onClick={() => onSlotClick('gk')}
          onRemove={() => removePlayer('gk')} />
      </div>

      {/* DEF 1 — 38% from top, left */}
      <div className="absolute" style={{ top: '36%', left: '25%', transform: 'translateX(-50%)' }}>
        <PitchSlot slotId="def1" label="DEF" player={squad.def1}
          isSelected={selectedSlot === 'def1'}
          onClick={() => onSlotClick('def1')}
          onRemove={() => removePlayer('def1')} />
      </div>

      {/* DEF 2 — 38% from top, right */}
      <div className="absolute" style={{ top: '36%', left: '75%', transform: 'translateX(-50%)' }}>
        <PitchSlot slotId="def2" label="DEF" player={squad.def2}
          isSelected={selectedSlot === 'def2'}
          onClick={() => onSlotClick('def2')}
          onRemove={() => removePlayer('def2')} />
      </div>

      {/* FWD 1 — 65% from top, left */}
      <div className="absolute" style={{ top: '63%', left: '25%', transform: 'translateX(-50%)' }}>
        <PitchSlot slotId="fwd1" label="FWD" player={squad.fwd1}
          isSelected={selectedSlot === 'fwd1'}
          onClick={() => onSlotClick('fwd1')}
          onRemove={() => removePlayer('fwd1')} />
      </div>

      {/* FWD 2 — 65% from top, right */}
      <div className="absolute" style={{ top: '63%', left: '75%', transform: 'translateX(-50%)' }}>
        <PitchSlot slotId="fwd2" label="FWD" player={squad.fwd2}
          isSelected={selectedSlot === 'fwd2'}
          onClick={() => onSlotClick('fwd2')}
          onRemove={() => removePlayer('fwd2')} />
      </div>
    </div>
  )
}
