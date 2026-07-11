import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  serverExternalPackages: [
    'pg',
    'pg-native',
    'eventsource',
    '@coral-xyz/anchor',
    '@solana/spl-token',
    'tweetnacl',
  ],
}

export default nextConfig
