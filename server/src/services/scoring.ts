import { Player } from '../db'

// ── Point values ──────────────────────────────────────────────────────────────

export const POINTS = {
  goal_gk:     10,
  goal_def:    6,
  goal_fwd:    4,
  assist:      3,
  yellow_card: -1,
  red_card:    -3,
  clean_sheet: 4,   // awarded end-of-match to GK/DEF if opponent scored 0
} as const

export type EventType = 'goal' | 'assist' | 'yellow_card' | 'red_card' | 'clean_sheet'

export function pointsForEvent(player: Player, event: EventType): number {
  switch (event) {
    case 'goal':
      return player.position === 'GK'  ? POINTS.goal_gk
           : player.position === 'DEF' ? POINTS.goal_def
           :                              POINTS.goal_fwd
    case 'assist':      return POINTS.assist
    case 'yellow_card': return POINTS.yellow_card
    case 'red_card':    return POINTS.red_card
    case 'clean_sheet': return POINTS.clean_sheet
  }
}

// ── Name matching (handles accents + case differences) ────────────────────────

function normalise(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

export function playerMatches(
  player: Player,
  playerName: string,
  teamName: string,
  playerId?: number | null,
): boolean {
  if (playerId != null && player.txoddsId != null) {
    return player.txoddsId === playerId
  }
  return (
    normalise(player.name)    === normalise(playerName) &&
    normalise(player.country) === normalise(teamName)
  )
}
