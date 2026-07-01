import { Router, Request, Response } from 'express'
import { getSquad, upsertSquad, lockSquad, deleteSquad, Player } from '../db'

const router = Router()

interface SquadBody {
  walletAddress: string
  squadName?: string
  squad: { gk: Player; def1: Player; def2: Player; fwd1: Player; fwd2: Player }
  locked?: boolean
}

// GET /api/squads/:wallet
router.get('/:wallet', (req: Request, res: Response) => {
  const record = getSquad(req.params.wallet)
  if (!record) return res.status(404).json({ error: 'Squad not found' })
  res.json(record)
})

// POST /api/squads  — create or overwrite
router.post('/', (req: Request, res: Response) => {
  const { walletAddress, squadName = '', squad, locked = false } = req.body as SquadBody

  if (!walletAddress || !squad?.gk || !squad?.def1 || !squad?.def2 || !squad?.fwd1 || !squad?.fwd2) {
    return res.status(400).json({ error: 'walletAddress and all 5 squad slots are required' })
  }

  const saved = upsertSquad({ walletAddress, squadName, squad, locked })
  res.status(201).json(saved)
})

// PATCH /api/squads/:wallet/lock
router.patch('/:wallet/lock', (req: Request, res: Response) => {
  const ok = lockSquad(req.params.wallet)
  if (!ok) return res.status(404).json({ error: 'Squad not found or already locked' })
  res.json({ message: 'Squad locked', walletAddress: req.params.wallet })
})

// DELETE /api/squads/:wallet
router.delete('/:wallet', (req: Request, res: Response) => {
  const ok = deleteSquad(req.params.wallet)
  if (!ok) return res.status(404).json({ error: 'Squad not found' })
  res.json({ message: 'Squad deleted' })
})

export default router
