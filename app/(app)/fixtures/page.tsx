'use client'
import { FixturesPanel } from '@/app/(app)/tournaments/page'

export default function FixturesPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ minHeight: 0, background: '#0a0e1a' }}>
      <div style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0, background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>Fixtures</h2>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '2px', letterSpacing: '0.05em' }}>FIFA World Cup 2026 · All matches</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto" style={{ minHeight: 0, padding: '20px 24px' }}>
        <FixturesPanel />
      </div>
    </div>
  )
}
