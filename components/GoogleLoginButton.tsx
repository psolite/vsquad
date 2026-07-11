'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { useWallet } from '@solana/wallet-adapter-react'

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

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" style={{ animation: 'spin 0.7s linear infinite' }}>
      <style>{'@keyframes spin { to { transform: rotate(360deg) } }'}</style>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export default function GoogleLoginButton() {
  const { ready, authenticated, user, login, logout } = usePrivy()
  const { publicKey, connected } = useWallet()
  const synced = useRef<string | null>(null)

  const syncMutation = useMutation({
    mutationFn: () => post('/api/auth/sync'),
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

  const email = user?.email?.address ?? user?.google?.email

  if (authenticated) {
    return (
      <div
        className="inline-flex items-center"
        style={{
          gap: '10px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px',
          padding: '8px 14px',
        }}
      >
        {syncMutation.isPending && <Spinner />}
        <span className="text-white/80" style={{ fontSize: '12px', fontWeight: 600 }}>
          {email ?? 'Signed in'}
        </span>
        <button
          onClick={() => logout()}
          className="text-white/70"
          style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => login()}
      className="inline-flex items-center justify-center"
      style={{
        gap: '10px',
        background: '#fff',
        color: '#1f1f1f',
        fontWeight: 700,
        fontSize: '14px',
        borderRadius: '10px',
        padding: '11px 22px',
        border: '1px solid rgba(0,0,0,0.08)',
        cursor: 'pointer',
        boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
      }}
    >
      <Image src="/Google.jpg" alt="" width={18} height={18} style={{ borderRadius: '3px' }} />
      Connect with Google
    </button>
  )
}
