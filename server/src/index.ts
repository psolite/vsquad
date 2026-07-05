import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import squadRoutes from './routes/squad'
import tournamentRoutes from './routes/tournament'
import scoresRoutes from './routes/scores'
import { authenticate, probeToken, startScoreStream } from './services/txodds/index'
import { startLiveScoring } from './services/liveScoring'
import { initDb } from './db'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhst:5173' }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/squads', squadRoutes)
app.use('/api/tournaments', tournamentRoutes)
app.use('/api/scores', scoresRoutes)

app.listen(PORT, async () => {
  await initDb()
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Database: PostgreSQL (Supabase)`)

  const existingToken = process.env.TXODDS_API_TOKEN

  const initTxodds = async (apiToken: string) => {
    ;(global as any).__txoddsToken = apiToken
    await probeToken(apiToken)
    startLiveScoring()
    await startScoreStream(apiToken)
    console.log('[txodds] live score stream started')
  }

  if (existingToken) {
    console.log('[txodds] using TXODDS_API_TOKEN from env')
    await initTxodds(existingToken)
  } else if (process.env.SERVER_WALLET_SECRET_KEY) {
    try {
      const { apiToken } = await authenticate()
      console.log('[txodds] save to .env to skip auth next restart: TXODDS_API_TOKEN=' + apiToken)
      await initTxodds(apiToken)
    } catch (err: any) {
      console.error('[txodds] init failed — live scores unavailable:', err.message)
    }
  } else {
    console.warn('[txodds] set TXODDS_API_TOKEN or SERVER_WALLET_SECRET_KEY to enable live data')
  }
})
