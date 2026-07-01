import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useSquadStore } from '../store/squadStore'
import { squadApi } from '../api/squadApi'

export default function LandingPage() {
  const { connected, publicKey } = useWallet()
  const navigate = useNavigate()
  const { loadSquad } = useSquadStore()
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (!connected || !publicKey) return

    const wallet = publicKey.toBase58()
    setChecking(true)

    squadApi.get(wallet)
      .then((record) => {
        // Existing squad found — restore it and jump straight to /my-squad
        loadSquad(record.squad, record.squadName, record.locked)
        navigate('/my-squad')
      })
      .catch(() => {
        // No saved squad — go to builder
        navigate('/squad')
      })
      .finally(() => setChecking(false))
  }, [connected, publicKey, navigate, loadSquad])

  return (
    <div
      className="relative flex flex-col items-center justify-center flex-1 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, #0b2a18 0%, #060d0a 55%, #040809 100%)', minHeight: '100vh' }}
    >
      {/* Background decorative pitch lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="fadeOut" cx="50%" cy="50%" r="50%">
            <stop offset="30%" stopColor="white" stopOpacity="0.045" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="8%" y="6%" width="84%" height="88%" rx="4" fill="none" stroke="url(#fadeOut)" strokeWidth="1" />
        <ellipse cx="50%" cy="50%" rx="16%" ry="22%" fill="none" stroke="url(#fadeOut)" strokeWidth="1" />
        <circle cx="50%" cy="50%" r="3" fill="white" opacity="0.06" />
        <line x1="8%" y1="50%" x2="92%" y2="50%" stroke="white" strokeOpacity="0.04" strokeWidth="1" />
        <path d="M 35% 6% Q 50% 18% 65% 6%" fill="none" stroke="white" strokeOpacity="0.04" strokeWidth="1" />
      </svg>

      {/* Glow orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '700px', height: '350px',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -60%)',
          background: 'radial-gradient(ellipse, rgba(0,255,135,0.09) 0%, transparent 70%)',
          filter: 'blur(48px)',
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center text-center w-full max-w-2xl px-6"
        style={{ gap: '1.25rem' }}
      >

        {/* Badge */}
        <div className="inline-flex items-center gap-3">
          <div className="h-px w-10 bg-[#00FF87]/40" />
          <span className="text-[#00FF87] text-xs font-black uppercase tracking-[0.3em]">
            FIFA World Cup 2026™
          </span>
          <div className="h-px w-10 bg-[#00FF87]/40" />
        </div>

        {/* Title */}
        <h1
          className="font-black uppercase leading-none select-none"
          style={{ fontSize: 'clamp(72px, 17vw, 148px)', letterSpacing: '-0.03em', margin: 0 }}
        >
          <span className="text-white">V</span>
          <span style={{ color: '#00FF87', textShadow: '0 0 100px rgba(0,255,135,0.4)' }}>SQUAD</span>
        </h1>

        {/* Tagline + formation */}
        <div className="flex flex-col items-center" style={{ gap: '0.5rem' }}>
          <p
            className="text-white/45 font-semibold uppercase"
            style={{ fontSize: 'clamp(12px, 2vw, 15px)', letterSpacing: '0.22em' }}
          >
            5-a-side Fantasy Football
          </p>

          <div className="flex flex-row items-center flex-nowrap" style={{ gap: '0.6rem' }}>
            {[
              { label: '1 GK',  bg: 'rgba(234,179,8,0.12)',  color: '#facc15', border: 'rgba(234,179,8,0.3)' },
              { label: '·',     bg: 'transparent',            color: 'rgba(255,255,255,0.2)', border: 'transparent' },
              { label: '2 DEF', bg: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
              { label: '·',     bg: 'transparent',            color: 'rgba(255,255,255,0.2)', border: 'transparent' },
              { label: '2 FWD', bg: 'rgba(239,68,68,0.12)',  color: '#f87171', border: 'rgba(239,68,68,0.3)' },
            ].map(({ label, bg, color, border }, i) =>
              label === '·'
                ? <span key={i} style={{ color, fontSize: '1rem', fontWeight: 700, lineHeight: 1 }}>·</span>
                : <span key={i} style={{ background: bg, color, border: `1px solid ${border}`, padding: '6px 16px', borderRadius: '999px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{label}</span>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="relative" style={{ padding: '0.5rem' }}>
          <div
            className="absolute inset-0 rounded-xl blur-xl opacity-35"
            style={{ background: '#00FF87', transform: 'scale(1.15)' }}
          />
          <WalletMultiButton />
          {checking && (
            <p style={{ color: 'rgba(0,255,135,0.6)', fontSize: '11px', fontWeight: 700, textAlign: 'center', marginTop: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Loading your squad…
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="w-full">
          <div className="w-full flex items-center gap-4" style={{ marginBottom: '0.75rem' }}>
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-white/20 text-[10px] uppercase font-bold" style={{ letterSpacing: '0.2em' }}>Tournament</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <div className="w-full grid grid-cols-3">
            {[
              { value: '48',  label: 'Nations' },
              { value: '104', label: 'Matches' },
              { value: '5',   label: 'Your Squad' },
            ].map(({ value, label }, i) => (
              <div key={i} className={`flex flex-col items-center ${i > 0 ? 'border-l border-white/8' : ''}`} style={{ gap: '0.25rem', padding: '0.25rem 0' }}>
                <span className="font-black text-white leading-none" style={{ fontSize: 'clamp(26px, 5vw, 40px)' }}>
                  {value}
                </span>
                <span className="text-white/30 text-[10px] font-medium uppercase" style={{ letterSpacing: '0.2em' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Powered by — pinned to bottom */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-2 pointer-events-none z-10">
        <span className="text-white/20 text-[10px] uppercase tracking-widest font-medium">Powered by</span>
        <span className="text-white/50 text-[11px] font-black uppercase tracking-widest">TXODDS</span>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(4,8,9,0.6), transparent)' }}
      />
    </div>
  )
}
