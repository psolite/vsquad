export interface PlayerLiveScore {
  playerId:    string
  name:        string
  position:    string
  country:     string
  goals:       number
  assists:     number
  yellowCards: number
  redCards:    number
  points:      number
}

export interface SquadLiveScore {
  walletAddress: string
  squadName:     string
  totalPoints:   number
  rank:          number
  players:       PlayerLiveScore[]
}

export interface Fixture {
  fixtureId:   string
  homeTeam:    string
  awayTeam:    string
  competition: string
  round:       string
  startTime:   number
  homeScore:   number | null
  awayScore:   number | null
  statusId:    number
  status:      'upcoming' | 'live' | 'finished'
  statusCode:  string | null
  minute:      number | null
}

export interface MatchesResponse {
  live:     Fixture[]
  today:    Fixture[]
  finished: Fixture[]
  upcoming: Fixture[]
}

export interface GoalEvent {
  fixtureId:  string
  playerName: string
  teamName:   string
  minute:     number
  score:      string
}

export interface MatchLiveScore {
  fixtureId:   string
  homeScore:   number
  awayScore:   number
  minute:      number
  matchStatus: 'live' | 'finished'
}

export const scoresApi = {
  leaderboard: async (): Promise<SquadLiveScore[]> => {
    const res = await fetch('/api/scores/leaderboard')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  },

  matches: async (): Promise<MatchesResponse> => {
    const res = await fetch('/api/scores/matches')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  },

  points: async (wallet: string, mode: 'today' | 'total' = 'today'): Promise<Record<string, number>> => {
    const res = await fetch(`/api/scores/points?wallet=${encodeURIComponent(wallet)}&mode=${mode}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  },

  // Per-player points a wallet earned within [start, end] (YYYY-MM-DD,
  // inclusive) — e.g. scoping a squad's breakdown to one tournament's window.
  pointsInRange: async (wallet: string, start: string, end: string): Promise<Record<string, number>> => {
    const res = await fetch(`/api/scores/points?wallet=${encodeURIComponent(wallet)}&mode=range&start=${start}&end=${end}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  },

  subscribeToLive(handlers: {
    onGoal?:        (e: GoalEvent) => void
    onLeaderboard?: (rows: SquadLiveScore[]) => void
    onMatchScore?:  (s: MatchLiveScore) => void
    onMatchScores?: (ss: MatchLiveScore[]) => void
    onScoreUpdate?: (data: unknown) => void
    onError?:       (e: Event) => void
  }): () => void {
    const es = new EventSource('/api/scores/live')
    const parse = (e: Event) => { try { return JSON.parse((e as MessageEvent).data) } catch { return null } }
    if (handlers.onGoal)         es.addEventListener('goal',          (e) => { const d = parse(e); if (d) handlers.onGoal!(d) })
    if (handlers.onLeaderboard)  es.addEventListener('leaderboard',   (e) => { const d = parse(e); if (d) handlers.onLeaderboard!(d) })
    if (handlers.onMatchScore)   es.addEventListener('match-score',   (e) => { const d = parse(e); if (d) handlers.onMatchScore!(d) })
    if (handlers.onMatchScores)  es.addEventListener('match-scores',  (e) => { const d = parse(e); if (d) handlers.onMatchScores!(d) })
    if (handlers.onScoreUpdate)  es.addEventListener('score-update',  (e) => { const d = parse(e); if (d) handlers.onScoreUpdate!(d) })
    if (handlers.onError) es.onerror = handlers.onError
    return () => es.close()
  },
}
