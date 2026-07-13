const ADJECTIVES = [
  'Thunder', 'Golden', 'Iron', 'Crimson', 'Shadow', 'Royal', 'Blazing',
  'Silver', 'Emerald', 'Savage', 'Mighty', 'Electric', 'Phantom', 'Rapid',
  'Fearless', 'Rogue', 'Atomic', 'Wild', 'Frost', 'Turbo',
]

const NOUNS = [
  'Strikers', 'Falcons', 'Wolves', 'Eagles', 'Titans', 'Panthers', 'Raiders',
  'Hawks', 'Lions', 'Vipers', 'Rangers', 'Warriors', 'Comets', 'Knights',
  'Dragons', 'Sharks', 'Bulls', 'Cobras', 'Storm', 'United',
]

export function randomSquadName(): string {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  return `${adjective} ${noun}`
}
