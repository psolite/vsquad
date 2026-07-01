export type Position = 'GK' | 'DEF' | 'FWD'

export interface Player {
  id: string
  name: string
  country: string
  flag: string
  position: Position
  goals: number
  caps: number
}

export type SlotId = 'gk' | 'def1' | 'def2' | 'fwd1' | 'fwd2'

export interface Squad {
  gk: Player | null
  def1: Player | null
  def2: Player | null
  fwd1: Player | null
  fwd2: Player | null
}
