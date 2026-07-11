export default function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ animation: 'vsquad-spin 0.7s linear infinite', flexShrink: 0 }}>
      <style>{'@keyframes vsquad-spin { to { transform: rotate(360deg) } }'}</style>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/** Centered "spinner + label" block used for full-panel loading states. */
export function LoadingState({ label, marginTop = '60px' }: { label: string; marginTop?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop, color: 'rgba(255,255,255,0.7)' }}>
      <Spinner size={14} />
      <p style={{ fontSize: '13px', margin: 0 }}>{label}</p>
    </div>
  )
}
