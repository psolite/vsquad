import type { Squad } from '../types'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export interface SquadResponse {
  walletAddress: string
  squadName: string
  squad: Squad
  locked: boolean
  createdAt: string
  updatedAt: string
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export const squadApi = {
  get: (wallet: string) =>
    request<SquadResponse>(`/api/squads/${wallet}`),

  save: (wallet: string, squadName: string, squad: Squad, locked = false) =>
    request<SquadResponse>('/api/squads', {
      method: 'POST',
      body: JSON.stringify({ walletAddress: wallet, squadName, squad, locked }),
    }),

  lock: (wallet: string) =>
    request<{ message: string }>(`/api/squads/${wallet}/lock`, { method: 'PATCH' }),

  delete: (wallet: string) =>
    request<{ message: string }>(`/api/squads/${wallet}`, { method: 'DELETE' }),
}
