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

  points: async (): Promise<Record<string, number>> => {
    const res = await fetch('/api/scores/points')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  },

  subscribeToLive(handlers: {
    onGoal?:        (e: GoalEvent) => void
    onLeaderboard?: (rows: SquadLiveScore[]) => void
    onScoreUpdate?: (data: unknown) => void
    onError?:       (e: Event) => void
  }): () => void {
    const es = new EventSource('/api/scores/live')
    if (handlers.onGoal)        es.addEventListener('goal',         (e) => { try { handlers.onGoal!(JSON.parse((e as MessageEvent).data)) } catch {} })
    if (handlers.onLeaderboard) es.addEventListener('leaderboard',  (e) => { try { handlers.onLeaderboard!(JSON.parse((e as MessageEvent).data)) } catch {} })
    if (handlers.onScoreUpdate) es.addEventListener('score-update', (e) => { try { handlers.onScoreUpdate!(JSON.parse((e as MessageEvent).data)) } catch {} })
    if (handlers.onError) es.onerror = handlers.onError
    return () => es.close()
  },
}
