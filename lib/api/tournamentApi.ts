export interface TournamentPayoutShare {
  rank: number
  basisPoints: number
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
  // Set only for tournaments backed by a real on-chain entry fee/prize pool —
  // see program-docs/tournament-program-design.md. Undefined means this is a
  // plain off-chain tournament (still fully supported).
  onChainId?: number
  tournamentPda?: string
  entryFeeLamports?: number
  payoutTable?: TournamentPayoutShare[]
}

export interface CreateTournamentInput {
  name: string
  description: string
  prize: string
  status: 'open' | 'active'
  startDate: string
  endDate: string
  maxParticipants: number
  onChainId?: number
  tournamentPda?: string
  entryFeeLamports?: number
  payoutTable?: TournamentPayoutShare[]
}

export interface CreateOnChainTournamentInput {
  name: string
  description: string
  prize: string
  startDate: string
  endDate: string
  maxParticipants: number
  entryFeeLamports: number
  payoutTable: TournamentPayoutShare[]
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export const tournamentApi = {
  list:   () =>
    request<Tournament[]>('/api/tournaments'),

  create: (data: CreateTournamentInput) =>
    request<Tournament>('/api/tournaments', { method: 'POST', body: JSON.stringify(data) }),

  // Backend signs initialize_tournament on-chain, then persists the link.
  // The creator's own creation-fee + entry payment happen separately,
  // client-side, once this resolves (see the tournaments page for the
  // combined transaction) — this call alone does not move the creator's funds.
  createOnChain: (data: CreateOnChainTournamentInput) =>
    request<Tournament>('/api/tournaments/init-onchain', { method: 'POST', body: JSON.stringify(data) }),

  join:   (id: string, walletAddress: string) =>
    request<Tournament>(`/api/tournaments/${id}/join`, { method: 'POST', body: JSON.stringify({ walletAddress }) }),

  leave:  (id: string, walletAddress: string) =>
    request<{ message: string }>(`/api/tournaments/${id}/leave`, { method: 'DELETE', body: JSON.stringify({ walletAddress }) }),
}
