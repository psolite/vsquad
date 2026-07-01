export interface CountryColor {
  primary: string
  secondary: string
  code: string
  flag: string | null
}

export const countryColors: Record<string, CountryColor> = {
  // ── EUROPE ──────────────────────────────────────────────────────
  'France':        { primary: '#002395', secondary: '#ED2939', code: 'FRA', flag: 'fra' },
  'England':       { primary: '#FFFFFF', secondary: '#CF0919', code: 'ENG', flag: 'eng' },
  'Germany':       { primary: '#111111', secondary: '#FFCC00', code: 'GER', flag: 'deu' },
  'Spain':         { primary: '#AA151B', secondary: '#F1BF00', code: 'ESP', flag: 'esp' },
  'Portugal':      { primary: '#006600', secondary: '#FF0000', code: 'POR', flag: 'prt' },
  'Netherlands':   { primary: '#FF6600', secondary: '#FFFFFF', code: 'NED', flag: 'nld' },
  'Belgium':       { primary: '#1a1a1a', secondary: '#EF3340', code: 'BEL', flag: 'bel' },
  'Croatia':       { primary: '#CC0000', secondary: '#FFFFFF', code: 'CRO', flag: 'hrv' },
  'Switzerland':   { primary: '#FF0000', secondary: '#FFFFFF', code: 'SUI', flag: 'che' },
  'Turkey':        { primary: '#E30A17', secondary: '#FFFFFF', code: 'TUR', flag: 'tur' },
  'Austria':       { primary: '#ED2939', secondary: '#FFFFFF', code: 'AUT', flag: 'aut' },
  'Scotland':      { primary: '#003F80', secondary: '#FFFFFF', code: 'SCO', flag: 'sco' },
  // ── SOUTH AMERICA ───────────────────────────────────────────────
  'Argentina':     { primary: '#74ACDF', secondary: '#FFFFFF', code: 'ARG', flag: 'arg' },
  'Brazil':        { primary: '#FFD700', secondary: '#009C3B', code: 'BRA', flag: 'bra' },
  'Uruguay':       { primary: '#5AAAE7', secondary: '#FFFFFF', code: 'URU', flag: 'ury' },
  'Colombia':      { primary: '#FCD116', secondary: '#003087', code: 'COL', flag: 'col' },
  'Ecuador':       { primary: '#FFD100', secondary: '#003893', code: 'ECU', flag: 'ecu' },
  // ── NORTH/CENTRAL AMERICA ────────────────────────────────────────
  'USA':           { primary: '#3C3B6E', secondary: '#B22234', code: 'USA', flag: 'usa' },
  'Mexico':        { primary: '#006847', secondary: '#CE1126', code: 'MEX', flag: 'mex' },
  'Canada':        { primary: '#FF0000', secondary: '#FFFFFF', code: 'CAN', flag: 'can' },
  'Panama':        { primary: '#005293', secondary: '#DA121A', code: 'PAN', flag: 'pan' },
  // ── AFRICA ──────────────────────────────────────────────────────
  'Morocco':       { primary: '#C1272D', secondary: '#006233', code: 'MAR', flag: 'mar' },
  'Senegal':       { primary: '#00853F', secondary: '#FDEF42', code: 'SEN', flag: 'sen' },
  'Egypt':         { primary: '#CC0000', secondary: '#FFFFFF', code: 'EGY', flag: 'egy' },
  'South Africa':  { primary: '#007A4D', secondary: '#FFB81C', code: 'RSA', flag: 'zaf' },
  'Ivory Coast':   { primary: '#F77F00', secondary: '#009A00', code: 'CIV', flag: 'civ' },
  // ── EUROPE (additional) ─────────────────────────────────────────
  'Serbia':        { primary: '#C6363C', secondary: '#0C4076', code: 'SRB', flag: 'srb' },
  'Denmark':       { primary: '#C60C30', secondary: '#FFFFFF', code: 'DEN', flag: 'dnk' },
  'Hungary':       { primary: '#CE2939', secondary: '#477050', code: 'HUN', flag: 'hun' },
  'Poland':        { primary: '#DC143C', secondary: '#FFFFFF', code: 'POL', flag: 'pol' },
  'Ukraine':       { primary: '#005BBB', secondary: '#FFD500', code: 'UKR', flag: 'ukr' },
  // ── SOUTH AMERICA (additional) ──────────────────────────────────
  'Venezuela':     { primary: '#CF142B', secondary: '#003893', code: 'VEN', flag: 'ven' },
  'Peru':          { primary: '#D91023', secondary: '#FFFFFF', code: 'PER', flag: 'per' },
  // ── NORTH/CENTRAL AMERICA (additional) ──────────────────────────
  'Costa Rica':    { primary: '#002B7F', secondary: '#CE1126', code: 'CRI', flag: 'cri' },
  'Honduras':      { primary: '#0073CF', secondary: '#FFFFFF', code: 'HON', flag: 'hnd' },
  // ── AFRICA (additional) ─────────────────────────────────────────
  'Nigeria':       { primary: '#008751', secondary: '#FFFFFF', code: 'NGA', flag: 'nga' },
  'Cameroon':      { primary: '#007A5E', secondary: '#CE1126', code: 'CMR', flag: 'cmr' },
  'Algeria':       { primary: '#006233', secondary: '#FFFFFF', code: 'ALG', flag: 'dza' },
  'Tunisia':       { primary: '#E70013', secondary: '#FFFFFF', code: 'TUN', flag: 'tun' },
  // ── ASIA / OCEANIA ──────────────────────────────────────────────
  'Japan':         { primary: '#BD0029', secondary: '#FFFFFF', code: 'JPN', flag: 'jpn' },
  'South Korea':   { primary: '#FFFFFF', secondary: '#CD2E3A', code: 'KOR', flag: 'kor' },
  'Saudi Arabia':  { primary: '#006C35', secondary: '#FFFFFF', code: 'KSA', flag: 'sau' },
  'Iran':          { primary: '#239F40', secondary: '#DA0000', code: 'IRN', flag: 'irn' },
  'Australia':     { primary: '#002B7F', secondary: '#FFD200', code: 'AUS', flag: 'aus' },
  'New Zealand':   { primary: '#000000', secondary: '#FFFFFF', code: 'NZL', flag: 'nzl' },
  // ── ASIA (additional) ───────────────────────────────────────────
  'Iraq':          { primary: '#CE1126', secondary: '#FFFFFF', code: 'IRQ', flag: 'irq' },
  'Qatar':         { primary: '#8D1B3D', secondary: '#FFFFFF', code: 'QAT', flag: 'qat' },
  'Uzbekistan':    { primary: '#1EB53A', secondary: '#FFFFFF', code: 'UZB', flag: 'uzb' },
}

export const defaultColors: CountryColor = { primary: '#1a4a2a', secondary: '#2a6a3a', code: '???', flag: null }
