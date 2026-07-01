import { countryColors, defaultColors } from '../data/countryColors'

interface Props {
  country: string
  size?: number
  shape?: 'rect' | 'circle'
}

export default function FlagImg({ country, size = 28, shape = 'rect' }: Props) {
  const colors = countryColors[country] ?? defaultColors

  if (colors.flag) {
    const radius = shape === 'circle' ? '50%' : '4px'
    return (
      <img
        src={`/flags/${colors.flag}.svg`}
        alt={country}
        width={shape === 'circle' ? size : Math.round(size * 1.5)}
        height={size}
        style={{
          borderRadius: radius,
          objectFit: 'cover',
          display: 'block',
          flexShrink: 0,
        }}
      />
    )
  }

  // Fallback: colored badge with country code
  if (shape === 'circle') {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        background: colors.primary,
        border: `2px solid ${colors.secondary}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: Math.round(size * 0.28) + 'px', fontWeight: 900,
        color: colors.primary === '#FFFFFF' ? '#111' : colors.secondary,
        letterSpacing: '0.02em',
      }}>
        {colors.code}
      </div>
    )
  }

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: Math.round(size * 1.5), height: size, borderRadius: '4px', flexShrink: 0,
      background: colors.primary,
      color: colors.primary === '#FFFFFF' ? '#111' : colors.secondary,
      fontSize: Math.round(size * 0.35) + 'px', fontWeight: 900, letterSpacing: '0.03em',
      boxShadow: `0 1px 4px ${colors.primary}44`,
    }}>
      {colors.code}
    </span>
  )
}
