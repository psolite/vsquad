'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'

function HomeIcon()     { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> }
function PitchIcon()    { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><circle cx="12" cy="12" r="3.5"/><line x1="2" y1="12" x2="5.5" y2="12"/><line x1="18.5" y1="12" x2="22" y2="12"/></svg> }
function SquadIcon()    { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
function TrophyIcon()   { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> }
function CalendarIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }

const NAV_ITEMS = [
  { href: '/home',        label: 'Home',        Icon: HomeIcon     },
  { href: '/squad',       label: 'Build Squad', Icon: PitchIcon    },
  { href: '/my-squad',   label: 'My Squad',    Icon: SquadIcon    },
  { href: '/tournaments', label: 'Tournaments', Icon: TrophyIcon   },
  { href: '/fixtures',    label: 'Fixtures',    Icon: CalendarIcon },
]

function shortKey(key: string) { return `${key.slice(0, 4)}…${key.slice(-4)}` }

export default function Sidebar() {
  const pathname = usePathname()
  const { publicKey, connected } = useWallet()

  return (
    <aside style={{ width: '220px', flexShrink: 0, height: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #080c18 0%, #070a14 100%)', borderRight: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 10 }}>

      {/* Logo */}
      <div style={{ padding: '20px 18px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'rgba(0,255,135,0.1)', border: '1px solid rgba(0,255,135,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', lineHeight: 1, flexShrink: 0 }}>⚽</div>
          <span style={{ fontWeight: 900, fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.14em', lineHeight: 1 }}>
            <span style={{ color: '#fff' }}>V</span><span style={{ color: '#00FF87' }}>SQUAD</span>
          </span>
        </Link>
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00FF87', boxShadow: '0 0 6px #00FF87' }} />
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em' }}>FIFA World Cup 2026</span>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', minHeight: 0 }}>
        <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px', paddingLeft: '8px' }}>Navigation</p>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '10px 12px', borderRadius: '10px', textDecoration: 'none', color: active ? '#00FF87' : 'rgba(255,255,255,0.42)', background: active ? 'rgba(0,255,135,0.08)' : 'transparent', border: `1px solid ${active ? 'rgba(0,255,135,0.15)' : 'transparent'}`, fontWeight: active ? 800 : 500, fontSize: '13px', letterSpacing: '0.01em', transition: 'all 0.15s', position: 'relative' }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,0.42)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' } }}
              >
                {active && <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '3px', height: '60%', borderRadius: '0 3px 3px 0', background: '#00FF87' }} />}
                <Icon />
                {label}
              </Link>
            )
          })}
        </nav>

        <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
          <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '12px', paddingLeft: '8px' }}>Tournament</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '8px' }}>
            {[{ label: 'Nations', value: '48' }, { label: 'Matches', value: '104' }, { label: 'Groups', value: '12' }].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontWeight: 500 }}>{label}</span>
                <span style={{ color: '#fff', fontSize: '12px', fontWeight: 800 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wallet */}
      <div style={{ padding: '14px 14px 18px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
        {connected && publicKey && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '10px 12px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0, background: 'rgba(0,255,135,0.15)', border: '1px solid rgba(0,255,135,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00FF87" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1px' }}>Connected</p>
              <p style={{ color: '#fff', fontSize: '11px', fontWeight: 700, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shortKey(publicKey.toBase58())}</p>
            </div>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00FF87', boxShadow: '0 0 5px #00FF87', flexShrink: 0 }} />
          </div>
        )}
        <WalletMultiButton style={{ width: '100%', justifyContent: 'center', fontSize: '12px' }} />
      </div>
    </aside>
  )
}
