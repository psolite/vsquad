import { NextRequest } from 'next/server'
import { scoreEmitter } from '@/lib/services/txodds/index'
import { liveScoringEmitter, buildLeaderboard } from '@/lib/services/liveScoring'
import type { GoalEvent } from '@/lib/services/txodds/index'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      const enqueue = (text: string) => {
        try { controller.enqueue(encoder.encode(text)) } catch { /* client disconnected */ }
      }

      // Send current leaderboard immediately
      enqueue(`event: leaderboard\ndata: ${JSON.stringify(buildLeaderboard())}\n\n`)

      const onGoal      = (e: GoalEvent)    => enqueue(`event: goal\ndata: ${JSON.stringify(e)}\n\n`)
      const onUpdate    = (d: unknown)       => enqueue(`event: score-update\ndata: ${JSON.stringify(d)}\n\n`)
      const onLeaderboard = (d: unknown)     => enqueue(`event: leaderboard\ndata: ${JSON.stringify(d)}\n\n`)

      scoreEmitter.on('goal',              onGoal)
      scoreEmitter.on('update',            onUpdate)
      liveScoringEmitter.on('leaderboard', onLeaderboard)

      const heartbeat = setInterval(() => enqueue(': heartbeat\n\n'), 30_000)

      request.signal.addEventListener('abort', () => {
        scoreEmitter.off('goal',              onGoal)
        scoreEmitter.off('update',            onUpdate)
        liveScoringEmitter.off('leaderboard', onLeaderboard)
        clearInterval(heartbeat)
        try { controller.close() } catch { /* already closed */ }
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type':      'text/event-stream',
      'Cache-Control':     'no-cache',
      'Connection':        'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
