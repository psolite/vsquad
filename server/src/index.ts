import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import squadRoutes from './routes/squad'
import tournamentRoutes from './routes/tournament'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/squads', squadRoutes)
app.use('/api/tournaments', tournamentRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Data stored in: db.json`)
})
