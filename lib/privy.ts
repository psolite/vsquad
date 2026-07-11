import { PrivyClient } from '@privy-io/server-auth'

const globalForPrivy = globalThis as unknown as { _privyClient?: PrivyClient }

export function privyClient(): PrivyClient {
  if (!globalForPrivy._privyClient) {
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID
    const appSecret = process.env.PRIVY_APP_SECRET
    if (!appId || !appSecret) throw new Error('NEXT_PUBLIC_PRIVY_APP_ID / PRIVY_APP_SECRET are not set')
    globalForPrivy._privyClient = new PrivyClient(appId, appSecret)
  }
  return globalForPrivy._privyClient
}

/** Verifies the Privy access token cookie sent by the client SDK and returns the Privy user id (DID), or null if missing/invalid. */
export async function getPrivyUserId(req: Request): Promise<string | null> {
  const cookieHeader = req.headers.get('cookie') ?? ''
  const token = cookieHeader.match(/(?:^|;\s*)privy-token=([^;]+)/)?.[1]
  if (!token) return null
  try {
    const claims = await privyClient().verifyAuthToken(decodeURIComponent(token))
    return claims.userId
  } catch {
    return null
  }
}
