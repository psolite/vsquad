'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { useWallet } from '@solana/wallet-adapter-react'
import Spinner from '@/components/Spinner'

async function post(path: string, body?: unknown) {
  const res = await fetch(path, {
    method: 'POST',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`)
  }
  return res.json()
}

export default function GoogleLoginButton() {
  const { ready, authenticated, user, login } = usePrivy()
  const { publicKey, connected } = useWallet()
  const router = useRouter()
  const synced = useRef<string | null>(null)

  const syncMutation = useMutation({
    mutationFn: () => post('/api/auth/sync'),
    onSuccess: () => router.push('/home'),
    onError: (err) => {
      console.error('[auth] failed to sync Privy user', err)
      toast.error('Could not complete sign-in. Please try again.')
    },
  })

  const linkWalletMutation = useMutation({
    mutationFn: (walletAddress: string) => post('/api/auth/link-wallet', { walletAddress }),
    onError: (err) => {
      console.error('[auth] failed to link wallet', err)
      toast.error(err instanceof Error ? err.message : 'Could not link your wallet to this account')
    },
  })

  useEffect(() => {
    if (!authenticated || !user) return
    if (synced.current === user.id) return
    synced.current = user.id
    syncMutation.mutate()
    // syncMutation is a new object every render; only re-run when the authenticated user changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, user])

  useEffect(() => {
    if (!authenticated || !connected || !publicKey) return
    linkWalletMutation.mutate(publicKey.toBase58())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, connected, publicKey])

  if (!ready) return null

  if (authenticated) {
    return (
      <div
        className="inline-flex items-center justify-center"
        style={{ gap: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 700 }}
      >
        <Spinner size={14} />
        Signing in…
      </div>
    )
  }

  return (
    <button
      onClick={() => login()}
      className="inline-flex items-center justify-center"
      style={{
        gap: '9px',
        background: '#fff',
        color: '#000',
        fontWeight: 700,
        fontSize: '13px',
        borderRadius: '10px',
        padding: '9px 18px',
        border: '1px solid rgba(0,0,0,0.15)',
        cursor: 'pointer',
        boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/Google.jpg" alt="" width={17} height={17} style={{ borderRadius: '3px', display: 'block', flexShrink: 0 }} />
      Connect with Google
    </button>
  )
}
