import { create } from 'zustand'
import type { Player, SlotId, Squad } from '../types'

interface SquadStore {
  squad: Squad
  selectedSlot: SlotId | null
  squadName: string
  locked: boolean
  setPlayer: (slot: SlotId, player: Player) => void
  removePlayer: (slot: SlotId) => void
  setSelectedSlot: (slot: SlotId | null) => void
  setSquadName: (name: string) => void
  lockSquad: () => void
  resetSquad: () => void
}

const emptySquad: Squad = {
  gk: null,
  def1: null,
  def2: null,
  fwd1: null,
  fwd2: null,
}

export const useSquadStore = create<SquadStore>((set) => ({
  squad: emptySquad,
  selectedSlot: null,
  squadName: '',
  locked: false,

  setPlayer: (slot, player) =>
    set((state) => ({ squad: { ...state.squad, [slot]: player }, selectedSlot: null })),

  removePlayer: (slot) =>
    set((state) => ({ squad: { ...state.squad, [slot]: null } })),

  setSelectedSlot: (slot) => set({ selectedSlot: slot }),

  setSquadName: (name) => set({ squadName: name }),

  lockSquad: () => set({ locked: true }),

  resetSquad: () => set({ squad: emptySquad, selectedSlot: null, locked: false, squadName: '' }),
}))

export const filledCount = (squad: Squad) =>
  Object.values(squad).filter(Boolean).length

export const isComplete = (squad: Squad) => filledCount(squad) === 5
