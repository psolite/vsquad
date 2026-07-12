export default function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="shrink-0 [animation:vsquad-spin_0.7s_linear_infinite]">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/** Centered "spinner + label" block used for full-panel loading states. */
export function LoadingState({ label, marginTop = 'mt-15' }: { label: string; marginTop?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 text-white/70 ${marginTop}`}>
      <Spinner size={14} />
      <p className="text-[13px] m-0">{label}</p>
    </div>
  )
}
