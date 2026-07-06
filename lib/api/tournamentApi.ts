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

export interface CreateTournamentInput {
  name: string
  description: string
  prize: string
  status: 'open' | 'active'
  startDate: string
  endDate: string
  maxParticipants: number
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

  join:   (id: string, walletAddress: string) =>
    request<Tournament>(`/api/tournaments/${id}/join`, { method: 'POST', body: JSON.stringify({ walletAddress }) }),

  leave:  (id: string, walletAddress: string) =>
    request<{ message: string }>(`/api/tournaments/${id}/leave`, { method: 'DELETE', body: JSON.stringify({ walletAddress }) }),
}
