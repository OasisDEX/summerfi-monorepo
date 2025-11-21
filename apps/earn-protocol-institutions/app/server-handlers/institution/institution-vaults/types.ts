export type VaultApyMap = {
  // ${string}-${string}` (fleetAddress-chainId)
  [key: string]: {
    apyLive: number | undefined
    apy24h: number | undefined
    apy7d: number | undefined
    apy30d: number | undefined
  }
}
export type VaultApyAverageMap = {
  apyLive: number | undefined
  apy24h: number | undefined
  apy7d: number | undefined
  apy30d: number | undefined
}
