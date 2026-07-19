import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // program/ is a separate Anchor/Rust workspace (Solana tournament program),
  // not part of this Next.js build. Its target/ dir (once built) fills with
  // thousands of Rust build artifacts — keep Next's file tracer from ever
  // walking into it.
  outputFileTracingExcludes: {
    '*': ['program/**'],
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
