import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/squad',       label: 'Build Squad' },
  { to: '/my-squad',   label: 'My Squad' },
  { to: '/tournaments', label: 'Tournaments' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  return (
    <nav
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        height: '56px',
        flexShrink: 0,
        background: isLanding ? 'transparent' : 'rgba(8,12,22,0.95)',
        backdropFilter: isLanding ? 'none' : 'blur(16px)',
        borderBottom: isLanding ? 'none' : '1px solid rgba(255,255,255,0.07)',
        position: isLanding ? 'absolute' : 'relative',
        top: 0, left: 0, right: 0,
        zIndex: 20,
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <span style={{ fontSize: '18px', lineHeight: 1 }}>⚽</span>
        <span style={{ fontWeight: 900, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
          <span style={{ color: '#ffffff' }}>V</span>
          <span style={{ color: '#00FF87' }}>SQUAD</span>
        </span>
      </Link>

      {/* Centre nav links */}
      {!isLanding && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {NAV_LINKS.map(({ to, label }) => {
            const active = pathname === to
            return (
              <Link
                key={to}
                to={to}
                style={{
                  textDecoration: 'none',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: active ? 900 : 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: active ? '#00FF87' : 'rgba(255,255,255,0.45)',
                  background: active ? 'rgba(0,255,135,0.1)' : 'transparent',
                  border: active ? '1px solid rgba(0,255,135,0.2)' : '1px solid transparent',
                  transition: 'all 0.15s',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.45)'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {label}
              </Link>
            )
          })}
        </div>
      )}

      {/* Right: FIFA badge + wallet */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', lineHeight: 1 }}>FIFA</span>
          <span style={{ color: '#00FF87', fontSize: '8px', fontWeight: 700, lineHeight: 1, marginTop: '2px', letterSpacing: '0.1em' }}>World Cup 2026</span>
        </div>
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />
        <WalletMultiButton />
      </div>
    </nav>
  )
}
