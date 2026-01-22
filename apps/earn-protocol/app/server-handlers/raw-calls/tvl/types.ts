export interface TvlVaultGroup {
  totalValueLockedUSD: number
  totalVaults: number
}

export interface TvlChainBreakdown {
  chainId: number
  publicVaults: TvlVaultGroup
  institutionalVaults: TvlVaultGroup
  totalValueLockedUSD: number
  totalVaults: number
}

export interface TvlResponse {
  protocol: TvlVaultGroup
  chains: TvlChainBreakdown[]
}
