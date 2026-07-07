'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="app-shell" style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0a0e1a' }}>

      <div className="app-topbar">
        <button
          onClick={() => setNavOpen(true)}
          aria-label="Open navigation"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: '6px', display: 'flex', alignItems: 'center' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <span style={{ fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.12em', lineHeight: 1 }}>
          <span style={{ color: '#fff' }}>V</span><span style={{ color: '#00FF87' }}>SQUAD</span>
        </span>
      </div>

      <div className={`app-drawer-backdrop ${navOpen ? 'app-drawer-backdrop--open' : ''}`} onClick={() => setNavOpen(false)} />

      <Sidebar mobileOpen={navOpen} onNavigate={() => setNavOpen(false)} />

      <div className="app-main" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {children}
      </div>
    </div>
  )
}
