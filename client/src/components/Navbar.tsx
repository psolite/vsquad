import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  return (
    <nav
      className="flex items-center justify-between px-6 py-4"
      style={{
        background: isLanding ? 'transparent' : 'rgba(10,14,26,0.9)',
        backdropFilter: isLanding ? 'none' : 'blur(12px)',
        borderBottom: isLanding ? 'none' : '1px solid rgba(255,255,255,0.06)',
        position: isLanding ? 'absolute' : 'relative',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 no-underline">
        <span className="text-xl select-none">⚽</span>
        <span className="font-black text-lg uppercase tracking-widest"
              style={{ letterSpacing: '0.12em' }}>
          <span className="text-white">V</span>
          <span style={{ color: '#00FF87' }}>SQUAD</span>
        </span>
      </Link>

      {/* Centre nav links (shown on inner pages) */}
      {!isLanding && (
        <div className="hidden md:flex items-center gap-1">
          <Link to="/squad"
                className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors no-underline text-white/50 hover:text-white hover:bg-white/5">
            Build Squad
          </Link>
          <Link to="/my-squad"
                className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors no-underline text-white/50 hover:text-white hover:bg-white/5">
            My Squad
          </Link>
        </div>
      )}

      {/* Right: World Cup badge + wallet */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-white/60 text-[10px] font-black uppercase tracking-widest leading-none">FIFA</span>
          <span className="text-[#00FF87] text-[9px] font-bold leading-none mt-0.5" style={{ letterSpacing: '0.1em' }}>World Cup 2026</span>
        </div>
        <div className="h-4 w-px bg-white/10 hidden sm:block" />
        <WalletMultiButton />
      </div>
    </nav>
  )
}
