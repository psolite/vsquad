import type { Player } from '../db'

export const POINTS = {
  appearance:  2,
  goal_gk:     10,
  goal_def:    6,
  goal_fwd:    4,
  assist:      3,
  yellow_card: -1,
  red_card:    -3,
  clean_sheet: 4,
} as const

export type EventType = 'appearance' | 'goal' | 'assist' | 'yellow_card' | 'red_card' | 'clean_sheet'

export function pointsForEvent(player: Player, event: EventType): number {
  switch (event) {
    case 'appearance':  return POINTS.appearance
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

function normalise(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

// TxOdds names players by their full legal name (e.g. "Kylian Mbappe
// Lottin"), while our roster stores the common display name ("Kylian
// Mbappé") — a strict equality check silently fails for anyone whose legal
// surname has extra parts, dropping every point they earn with no error.
// Treat it as a match when one name is a whole-word prefix of the other, so
// "kylian mbappe" still matches "kylian mbappe lottin".
function namesMatch(a: string, b: string): boolean {
  const wordsA = normalise(a).split(/\s+/).filter(Boolean)
  const wordsB = normalise(b).split(/\s+/).filter(Boolean)
  const len = Math.min(wordsA.length, wordsB.length)
  if (len === 0) return false
  for (let i = 0; i < len; i++) if (wordsA[i] !== wordsB[i]) return false
  return true
}

export function playerMatches(
  player: Player,
  playerName: string,
  teamName: string,
  playerId?: number | null,
): boolean {
  if (playerId != null && player.txoddsId != null) return player.txoddsId === playerId
  return (
    namesMatch(player.name, playerName) &&
    normalise(player.country) === normalise(teamName)
  )
}
