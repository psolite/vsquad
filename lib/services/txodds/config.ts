export function cfg() {
  const isDevnet = process.env.TXODDS_NETWORK === 'devnet'
  const origin   = isDevnet
    ? 'https://txline-dev.txodds.com'
    : 'https://txline.txodds.com'
  return {
    isDevnet,
    origin,
    apiBase:       `${origin}/api`,
    rpcUrl:        isDevnet ? 'https://api.devnet.solana.com' : 'https://api.mainnet-beta.solana.com',
    programId:     isDevnet
      ? '6pW64gN1s2uqjHkn1unFeEjAwJkPGHoppGvS715wyP2J'
      : '9ExbZjAapQww1vfcisDmrngPinHTEfpjYRWMunJgcKaA',
    txlMint:       process.env.TXODDS_TXL_MINT || '4Zao8ocPhmMgq7PdsYWyxvqySMGx7xb9cMftPMkEokRG',
    leagues:       (process.env.TXODDS_LEAGUES || '1').split(',').map(Number),
    serviceLevel:  Number(process.env.TXODDS_SERVICE_LEVEL || '1'),
    durationWeeks: 4,
  }
}
