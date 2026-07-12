'use client'
import type { Squad, SlotId } from '@/types'
import PitchSlot from './PitchSlot'
import { useSquadStore } from '@/store/squadStore'

interface Props {
  squad: Squad
  selectedSlot: SlotId | null
  onSlotClick: (slot: SlotId) => void
}

export default function Pitch({ squad, selectedSlot, onSlotClick }: Props) {
  const removePlayer = useSquadStore((s) => s.removePlayer)

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden select-none min-h-0 bg-[linear-gradient(180deg,#2e7d32_0%,#388e3c_30%,#2e7d32_60%,#388e3c_100%)]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 68" preserveAspectRatio="xMidYMid slice">
        <rect x="2.5" y="2.5" width="95" height="63" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />
        <rect x="21" y="2.5" width="58" height="21" fill="none" stroke="white" strokeWidth="0.4" opacity="0.4" />
        <rect x="34" y="2.5" width="32" height="8" fill="none" stroke="white" strokeWidth="0.4" opacity="0.4" />
        <circle cx="50" cy="17" r="0.9" fill="white" opacity="0.45" />
        <line x1="2.5" y1="65.5" x2="97.5" y2="65.5" stroke="white" strokeWidth="0.45" opacity="0.5" />
        <path d="M 37,65.5 A 13,13 0 0,0 63,65.5" fill="none" stroke="white" strokeWidth="0.4" opacity="0.4" />
        <circle cx="50" cy="65.5" r="0.9" fill="white" opacity="0.45" />
        <path d="M2.5,2.5 a4,4 0 0,1 4,4"   fill="none" stroke="white" strokeWidth="0.4" opacity="0.35" />
        <path d="M97.5,2.5 a4,4 0 0,0 -4,4" fill="none" stroke="white" strokeWidth="0.4" opacity="0.35" />
      </svg>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[28%]">
        <div className="w-full h-0.75 bg-white/65 rounded-b-sm" />
        <div className="w-full h-2.5 flex justify-between">
          <div className="w-0.75 h-full bg-white/65" />
          <div className="w-0.75 h-full bg-white/65" />
        </div>
      </div>

      <div className="absolute flex justify-between px-2 top-[4%] left-0 right-0">
        {[0, 1].map((i) => (
          <div key={i} className="flex flex-col items-center opacity-50">
            <span className="text-white font-black leading-none text-[6px] tracking-widest">FIFA</span>
            <span className="text-accent font-bold leading-none mt-0.5 text-[5px] tracking-wider">World Cup 2026</span>
          </div>
        ))}
      </div>

      <div className="absolute top-[10%] left-1/2 -translate-x-1/2">
        <PitchSlot slotId="gk" label="GK" player={squad.gk} isSelected={selectedSlot === 'gk'} onClick={() => onSlotClick('gk')} onRemove={() => removePlayer('gk')} />
      </div>
      <div className="absolute top-[40%] left-1/4 -translate-x-1/2">
        <PitchSlot slotId="def1" label="DEF" player={squad.def1} isSelected={selectedSlot === 'def1'} onClick={() => onSlotClick('def1')} onRemove={() => removePlayer('def1')} />
      </div>
      <div className="absolute top-[40%] left-3/4 -translate-x-1/2">
        <PitchSlot slotId="def2" label="DEF" player={squad.def2} isSelected={selectedSlot === 'def2'} onClick={() => onSlotClick('def2')} onRemove={() => removePlayer('def2')} />
      </div>
      <div className="absolute top-[70%] left-1/4 -translate-x-1/2">
        <PitchSlot slotId="fwd1" label="FWD" player={squad.fwd1} isSelected={selectedSlot === 'fwd1'} onClick={() => onSlotClick('fwd1')} onRemove={() => removePlayer('fwd1')} />
      </div>
      <div className="absolute top-[70%] left-3/4 -translate-x-1/2">
        <PitchSlot slotId="fwd2" label="FWD" player={squad.fwd2} isSelected={selectedSlot === 'fwd2'} onClick={() => onSlotClick('fwd2')} onRemove={() => removePlayer('fwd2')} />
      </div>
    </div>
  )
}
