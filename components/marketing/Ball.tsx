export function Ball({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <circle cx="12" cy="12" r="11" fill="white" fillOpacity="0.92" stroke="black" strokeOpacity="0.18" strokeWidth="0.5" />
      <path
        d="M12 6.2l3.7 2.7-1.4 4.3h-4.6L8.3 8.9 12 6.2z"
        fill="black"
        fillOpacity="0.7"
      />
      <path
        d="M12 2.4v3.8M6.6 8.9L3.3 7.8M17.4 8.9l3.3-1.1M9.7 13.2l-2 3.6M14.3 13.2l2 3.6"
        stroke="black"
        strokeOpacity="0.35"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
