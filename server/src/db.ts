import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(__dirname, '..', 'db.json')

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Player {
  id: string
  name: string
  country: string
  flag: string
  position: 'GK' | 'DEF' | 'FWD'
  goals: number
  caps: number
  txoddsId?: number
}

export interface SquadRecord {
  walletAddress: string
  squadName: string
  squad: { gk: Player; def1: Player; def2: Player; fwd1: Player; fwd2: Player }
  locked: boolean
  createdAt: string
  updatedAt: string
}

export interface Tournament {
  id: string
  name: string
  description: string
  prize: string
  status: 'open' | 'active' | 'ended'
  startDate: string
  endDate: string
  maxParticipants: number
  participants: string[]   // wallet addresses
}

interface DB {
  squads: Record<string, SquadRecord>
  tournaments: Record<string, Tournament>
}

// ── Seed tournaments (written once if not present) ────────────────────────────

const SEED_TOURNAMENTS: Tournament[] = [
  {
    id: 'vsquad-global-2026',
    name: 'VSquad Global League',
    description: 'The main VSquad competition for FIFA World Cup 2026. Pick your best 5-a-side and go head-to-head with fans worldwide.',
    prize: 'Global Bragging Rights + VSquad Champion Badge',
    status: 'open',
    startDate: '2026-06-11T00:00:00Z',
    endDate: '2026-07-19T00:00:00Z',
    maxParticipants: 10000,
    participants: [],
  },
  {
    id: 'group-stage-sprint',
    name: 'Group Stage Sprint',
    description: 'Score the most points during the group stage only. Fast, high-stakes, first 3 weeks of the tournament.',
    prize: 'Early Bird Trophy',
    status: 'active',
    startDate: '2026-06-11T00:00:00Z',
    endDate: '2026-07-03T00:00:00Z',
    maxParticipants: 5000,
    participants: [],
  },
  {
    id: 'knockout-kings',
    name: 'Knockout Kings',
    description: 'Only the Round of 32 onwards counts. Every game is a final. Who has the best squad for the business end?',
    prize: 'Knockout Kings Trophy',
    status: 'open',
    startDate: '2026-07-04T00:00:00Z',
    endDate: '2026-07-19T00:00:00Z',
    maxParticipants: 3000,
    participants: [],
  },
  {
    id: 'underdogs-cup',
    name: 'Underdogs Cup',
    description: 'Only players from nations ranked outside the top 20 count. Think outside the box — the underdog always surprises.',
    prize: 'Underdog Champion Badge',
    status: 'open',
    startDate: '2026-06-11T00:00:00Z',
    endDate: '2026-07-19T00:00:00Z',
    maxParticipants: 2000,
    participants: [],
  },
]

// ── IO ────────────────────────────────────────────────────────────────────────

function load(): DB {
  if (!fs.existsSync(DB_PATH)) {
    const fresh: DB = { squads: {}, tournaments: {} }
    SEED_TOURNAMENTS.forEach((t) => { fresh.tournaments[t.id] = t })
    save(fresh)
    return fresh
  }

  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')) as DB

  // Seed any missing tournaments without overwriting existing ones
  if (!db.tournaments) db.tournaments = {}
  let dirty = false
  SEED_TOURNAMENTS.forEach((t) => {
    if (!db.tournaments[t.id]) { db.tournaments[t.id] = t; dirty = true }
  })
  if (dirty) save(db)

  return db
}

function save(data: DB): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

// ── Squad helpers ─────────────────────────────────────────────────────────────

export function getSquad(walletAddress: string): SquadRecord | undefined {
  return load().squads[walletAddress]
}

export function getAllSquads(): SquadRecord[] {
  return Object.values(load().squads)
}

export function upsertSquad(record: Omit<SquadRecord, 'createdAt' | 'updatedAt'>): SquadRecord {
  const db = load()
  const now = new Date().toISOString()
  const existing = db.squads[record.walletAddress]
  const saved: SquadRecord = { ...record, createdAt: existing?.createdAt ?? now, updatedAt: now }
  db.squads[record.walletAddress] = saved
  save(db)
  return saved
}

export function lockSquad(walletAddress: string): boolean {
  const db = load()
  const record = db.squads[walletAddress]
  if (!record || record.locked) return false
  record.locked = true
  record.updatedAt = new Date().toISOString()
  save(db)
  return true
}

export function deleteSquad(walletAddress: string): boolean {
  const db = load()
  if (!db.squads[walletAddress]) return false
  delete db.squads[walletAddress]
  save(db)
  return true
}

// ── Tournament helpers ────────────────────────────────────────────────────────

export function listTournaments(): Tournament[] {
  return Object.values(load().tournaments)
}

export function getTournament(id: string): Tournament | undefined {
  return load().tournaments[id]
}

export function joinTournament(id: string, walletAddress: string): Tournament | null {
  const db = load()
  const t = db.tournaments[id]
  if (!t) return null
  if (t.participants.includes(walletAddress)) return t             // already joined
  if (t.participants.length >= t.maxParticipants) return null      // full
  t.participants.push(walletAddress)
  save(db)
  return t
}

export function leaveTournament(id: string, walletAddress: string): boolean {
  const db = load()
  const t = db.tournaments[id]
  if (!t) return false
  const idx = t.participants.indexOf(walletAddress)
  if (idx === -1) return false
  t.participants.splice(idx, 1)
  save(db)
  return true
}

export function createTournament(data: Omit<Tournament, 'id' | 'participants'>): Tournament {
  const db = load()
  const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  const tournament: Tournament = { ...data, id, participants: [] }
  db.tournaments[id] = tournament
  save(db)
  return tournament
}
