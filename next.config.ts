import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
