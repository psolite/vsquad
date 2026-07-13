import { countryColors } from '@/data/countryColors'

const TEAM_NAME_MAP: Record<string, string> = {
  'United States':          'USA', 'US': 'USA',
  'Korea Republic':         'South Korea', 'Republic of Korea': 'South Korea',
  'IR Iran':                'Iran',
  "Côte d'Ivoire":          'Ivory Coast', "Cote d'Ivoire": 'Ivory Coast',
  'DR Congo':               'Congo DR', 'Democratic Republic of the Congo': 'Congo DR',
  'Czechia':                'Czech Republic',
  'Bosnia-Herzegovina':     'Bosnia & Herzegovina', 'Bosnia and Herzegovina': 'Bosnia & Herzegovina',
  'China PR':               'China',
}

// Fixture feeds spell country names inconsistently ("United States" vs "USA",
// accents, casing, ...) — resolve to whatever key our own country data uses.
export function resolveTeam(name: string): string {
  if (!name) return name
  if (TEAM_NAME_MAP[name]) return TEAM_NAME_MAP[name]
  if (countryColors[name])  return name
  const lower = name.toLowerCase()
  const key = Object.keys(countryColors).find(k => k.toLowerCase() === lower)
  return key ?? name
}

export function teamCode(name: string): string {
  const resolved = resolveTeam(name)
  return countryColors[resolved]?.code ?? name.slice(0, 3).toUpperCase()
}
