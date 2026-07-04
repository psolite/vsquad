import { Router, Request, Response } from 'express'
import { listTournaments, getTournament, joinTournament, leaveTournament, createTournament, getSquad } from '../db'

const router = Router()

// GET /api/tournaments
router.get('/', async (_req: Request, res: Response) => {
  res.json(await listTournaments())
})

// POST /api/tournaments  — create a new tournament
router.post('/', async (req: Request, res: Response) => {
  const { name, description, prize, status, startDate, endDate, maxParticipants } =
    req.body as {
      name?: string; description?: string; prize?: string
      status?: string; startDate?: string; endDate?: string; maxParticipants?: number
    }

  if (!name || !description || !startDate || !endDate) {
    return res.status(400).json({ error: 'name, description, startDate and endDate are required' })
  }

  const t = await createTournament({
    name,
    description,
    prize:           prize ?? '',
    status:          (status as 'open' | 'active' | 'ended') ?? 'open',
    startDate,
    endDate,
    maxParticipants: Number(maxParticipants) || 1000,
  })

  res.status(201).json(t)
})

// GET /api/tournaments/:id
router.get('/:id', async (req: Request, res: Response) => {
  const t = await getTournament(req.params.id)
  if (!t) return res.status(404).json({ error: 'Tournament not found' })
  res.json(t)
})

// POST /api/tournaments/:id/join  — body: { walletAddress }
router.post('/:id/join', async (req: Request, res: Response) => {
  const { walletAddress } = req.body as { walletAddress?: string }
  if (!walletAddress) return res.status(400).json({ error: 'walletAddress is required' })

  const squad = await getSquad(walletAddress)
  if (!squad) return res.status(403).json({ error: 'You must save a squad before joining a tournament' })

  const t = await joinTournament(req.params.id, walletAddress)
  if (!t) return res.status(400).json({ error: 'Tournament not found or is full' })

  res.json(t)
})

// DELETE /api/tournaments/:id/leave  — body: { walletAddress }
router.delete('/:id/leave', async (req: Request, res: Response) => {
  const { walletAddress } = req.body as { walletAddress?: string }
  if (!walletAddress) return res.status(400).json({ error: 'walletAddress is required' })

  const ok = await leaveTournament(req.params.id, walletAddress)
  if (!ok) return res.status(404).json({ error: 'Not a participant or tournament not found' })

  res.json({ message: 'Left tournament', tournamentId: req.params.id })
})

export default router
