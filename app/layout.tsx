import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'VSquad — 5-a-Side Fantasy Football · FIFA World Cup 2026',
  description: 'Pick your 5-a-side squad from the World Cup 2026 player pool and compete in leagues.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <body style={{ height: '100%', margin: 0 }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
