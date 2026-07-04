import { Pool } from 'pg'

let _pool: Pool | null = null
function pool(): Pool {
  if (!_pool) {
    if (!process.env.DATABASE_DIRECT_URL) throw new Error('DATABASE_DIRECT_URL is not set in .env')
    _pool = new Pool({ connectionString: process.env.DATABASE_DIRECT_URL })
  }
  return _pool
}

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
  participants: string[]
}

// ── Schema init ───────────────────────────────────────────────────────────────

export async function initDb(): Promise<void> {
  await pool().query(`
    CREATE TABLE IF NOT EXISTS squads (
      wallet_address TEXT PRIMARY KEY,
      squad_name     TEXT NOT NULL DEFAULT '',
      squad          JSONB NOT NULL,
      locked         BOOLEAN NOT NULL DEFAULT FALSE,
      created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS tournaments (
      id               TEXT PRIMARY KEY,
      name             TEXT NOT NULL,
      description      TEXT NOT NULL DEFAULT '',
      prize            TEXT NOT NULL DEFAULT '',
      status           TEXT NOT NULL DEFAULT 'open',
      start_date       TIMESTAMPTZ NOT NULL,
      end_date         TIMESTAMPTZ NOT NULL,
      max_participants INTEGER NOT NULL DEFAULT 1000,
      participants     TEXT[] NOT NULL DEFAULT '{}'
    );
  `)

  // Seed default tournaments (ignore conflicts so re-starts are safe)
  await pool().query(`
    INSERT INTO tournaments (id, name, description, prize, status, start_date, end_date, max_participants)
    VALUES
      ('vsquad-global-2026',  'VSquad Global League',
       'The main VSquad competition for FIFA World Cup 2026. Pick your best 5-a-side and go head-to-head with fans worldwide.',
       'Global Bragging Rights + VSquad Champion Badge', 'open',
       '2026-06-11T00:00:00Z', '2026-07-19T00:00:00Z', 10000),
      ('group-stage-sprint', 'Group Stage Sprint',
       'Score the most points during the group stage only. Fast, high-stakes, first 3 weeks of the tournament.',
       'Early Bird Trophy', 'active',
       '2026-06-11T00:00:00Z', '2026-07-03T00:00:00Z', 5000),
      ('knockout-kings',     'Knockout Kings',
       'Only the Round of 32 onwards counts. Every game is a final. Who has the best squad for the business end?',
       'Knockout Kings Trophy', 'open',
       '2026-07-04T00:00:00Z', '2026-07-19T00:00:00Z', 3000),
      ('underdogs-cup',      'Underdogs Cup',
       'Only players from nations ranked outside the top 20 count. Think outside the box — the underdog always surprises.',
       'Underdog Champion Badge', 'open',
       '2026-06-11T00:00:00Z', '2026-07-19T00:00:00Z', 2000)
    ON CONFLICT (id) DO NOTHING;
  `)
}

// ── Row mappers ───────────────────────────────────────────────────────────────

function rowToSquad(row: Record<string, unknown>): SquadRecord {
  return {
    walletAddress: row.wallet_address as string,
    squadName:     row.squad_name as string,
    squad:         row.squad as SquadRecord['squad'],
    locked:        row.locked as boolean,
    createdAt:     (row.created_at as Date).toISOString(),
    updatedAt:     (row.updated_at as Date).toISOString(),
  }
}

function rowToTournament(row: Record<string, unknown>): Tournament {
  return {
    id:              row.id as string,
    name:            row.name as string,
    description:     row.description as string,
    prize:           row.prize as string,
    status:          row.status as Tournament['status'],
    startDate:       (row.start_date as Date).toISOString(),
    endDate:         (row.end_date as Date).toISOString(),
    maxParticipants: row.max_participants as number,
    participants:    row.participants as string[],
  }
}

// ── Squad helpers ─────────────────────────────────────────────────────────────

export async function getSquad(walletAddress: string): Promise<SquadRecord | undefined> {
  const { rows } = await pool().query(
    'SELECT * FROM squads WHERE wallet_address = $1',
    [walletAddress]
  )
  return rows[0] ? rowToSquad(rows[0]) : undefined
}

export async function getAllSquads(): Promise<SquadRecord[]> {
  const { rows } = await pool().query('SELECT * FROM squads ORDER BY updated_at DESC')
  return rows.map(rowToSquad)
}

export async function upsertSquad(
  record: Omit<SquadRecord, 'createdAt' | 'updatedAt'>
): Promise<SquadRecord> {
  const { rows } = await pool().query(
    `INSERT INTO squads (wallet_address, squad_name, squad, locked)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (wallet_address) DO UPDATE SET
       squad_name = EXCLUDED.squad_name,
       squad      = EXCLUDED.squad,
       locked     = EXCLUDED.locked,
       updated_at = NOW()
     RETURNING *`,
    [record.walletAddress, record.squadName, JSON.stringify(record.squad), record.locked]
  )
  return rowToSquad(rows[0])
}

export async function lockSquad(walletAddress: string): Promise<boolean> {
  const { rowCount } = await pool().query(
    `UPDATE squads SET locked = TRUE, updated_at = NOW()
     WHERE wallet_address = $1 AND locked = FALSE`,
    [walletAddress]
  )
  return (rowCount ?? 0) > 0
}

export async function deleteSquad(walletAddress: string): Promise<boolean> {
  const { rowCount } = await pool().query(
    'DELETE FROM squads WHERE wallet_address = $1',
    [walletAddress]
  )
  return (rowCount ?? 0) > 0
}

// ── Tournament helpers ────────────────────────────────────────────────────────

export async function listTournaments(): Promise<Tournament[]> {
  const { rows } = await pool().query('SELECT * FROM tournaments ORDER BY start_date ASC')
  return rows.map(rowToTournament)
}

export async function getTournament(id: string): Promise<Tournament | undefined> {
  const { rows } = await pool().query('SELECT * FROM tournaments WHERE id = $1', [id])
  return rows[0] ? rowToTournament(rows[0]) : undefined
}

export async function joinTournament(id: string, walletAddress: string): Promise<Tournament | null> {
  // Check exists, not full, and not already joined — then append atomically
  const { rows } = await pool().query(
    `UPDATE tournaments
     SET participants = array_append(participants, $2)
     WHERE id = $1
       AND NOT ($2 = ANY(participants))
       AND array_length(participants, 1) < max_participants
     RETURNING *`,
    [id, walletAddress]
  )
  if (rows[0]) return rowToTournament(rows[0])

  // Already joined — return current state without error
  const existing = await getTournament(id)
  if (existing?.participants.includes(walletAddress)) return existing
  return null
}

export async function leaveTournament(id: string, walletAddress: string): Promise<boolean> {
  const { rowCount } = await pool().query(
    `UPDATE tournaments
     SET participants = array_remove(participants, $2)
     WHERE id = $1 AND $2 = ANY(participants)`,
    [id, walletAddress]
  )
  return (rowCount ?? 0) > 0
}

export async function createTournament(
  data: Omit<Tournament, 'id' | 'participants'>
): Promise<Tournament> {
  const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  const { rows } = await pool().query(
    `INSERT INTO tournaments (id, name, description, prize, status, start_date, end_date, max_participants)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [id, data.name, data.description, data.prize, data.status, data.startDate, data.endDate, data.maxParticipants]
  )
  return rowToTournament(rows[0])
}
