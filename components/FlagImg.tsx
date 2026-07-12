'use client'
import { countryColors, defaultColors } from '@/data/countryColors'

interface Props {
  country: string
  size?: number
  shape?: 'rect' | 'circle'
}

export default function FlagImg({ country, size = 28, shape = 'rect' }: Props) {
  const colors = countryColors[country] ?? defaultColors

  if (colors.flag) {
    return (
      <img
        src={`/flags/${colors.flag}.svg`}
        alt={country}
        width={shape === 'circle' ? size : Math.round(size * 1.5)}
        height={size}
        className={`${shape === 'circle' ? 'rounded-full' : 'rounded-sm'} object-cover block shrink-0`}
      />
    )
  }

  if (shape === 'circle') {
    return (
      <div
        className="rounded-full shrink-0 flex items-center justify-center font-black tracking-[0.02em]"
        style={{ width: size, height: size, background: colors.primary, border: `2px solid ${colors.secondary}`, fontSize: Math.round(size * 0.28) + 'px', color: colors.primary === '#FFFFFF' ? '#111' : colors.secondary }}
      >
        {colors.code}
      </div>
    )
  }

  return (
    <span
      className="inline-flex items-center justify-center rounded-sm shrink-0 font-black tracking-[0.03em]"
      style={{ width: Math.round(size * 1.5), height: size, background: colors.primary, color: colors.primary === '#FFFFFF' ? '#111' : colors.secondary, fontSize: Math.round(size * 0.35) + 'px', boxShadow: `0 1px 4px ${colors.primary}44` }}
    >
      {colors.code}
    </span>
  )
}
