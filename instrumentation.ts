export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const { initDb } = await import('./lib/db')
  const { refreshSquadCache, startLiveScoring } = await import('./lib/services/liveScoring')
  const { probeToken, startScoreStream } = await import('./lib/services/txodds/index')

  try {
    await initDb()
    console.log('[db] PostgreSQL ready')
  } catch (err: unknown) {
    console.error('[db] init failed:', (err as Error).message)
    return
  }

  await refreshSquadCache()

  const existingToken = process.env.TXODDS_API_TOKEN

  const initTxodds = async (apiToken: string) => {
    ;(global as Record<string, unknown>).__txoddsToken = apiToken
    await probeToken(apiToken)
    startLiveScoring()
    await startScoreStream(apiToken)
    console.log('[txodds] live score stream started')
  }

  if (existingToken) {
    console.log('[txodds] using TXODDS_API_TOKEN from env')
    await initTxodds(existingToken).catch((err: unknown) =>
      console.error('[txodds] init failed:', (err as Error).message)
    )
  } else if (process.env.SERVER_WALLET_SECRET_KEY) {
    try {
      const { authenticate } = await import('./lib/services/txodds/activate')
      const { apiToken } = await authenticate()
      console.log('[txodds] token acquired — add to .env.local: TXODDS_API_TOKEN=' + apiToken)
      await initTxodds(apiToken)
    } catch (err: unknown) {
      console.error('[txodds] auth failed — live scores unavailable:', (err as Error).message)
    }
  } else {
    console.warn('[txodds] set TXODDS_API_TOKEN or SERVER_WALLET_SECRET_KEY to enable live data')
  }
}
