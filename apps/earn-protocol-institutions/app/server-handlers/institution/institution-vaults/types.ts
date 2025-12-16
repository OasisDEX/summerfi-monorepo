export type VaultApyMap = {
  // ${string}-${string}` (fleetAddress-chainId)
  [key: string]: {
    apyLive: number | undefined
    apy24h: number | undefined
    apy7d: number | undefined
    apy30d: number | undefined
  }
}

export type VaultSharePriceMap = {
  // ${string}-${string}` (fleetAddress-chainId)
  [key: string]: string | undefined
}

export type VaultApyAverageMap = {
  apyLive: number | undefined
  apy24h: number | undefined
  apy7d: number | undefined
  apy30d: number | undefined
}

export type VaultAdditionalInfo = {
  vaultApyMap: VaultApyMap
  vaultsApyAverages: VaultApyAverageMap
  vaultSharePriceMap: VaultSharePriceMap
}

export type InstiVaultsPerformanceDataPoint = {
  netValue: string
  navPrice: string
  timestamp: string
}

export type InstiVaultPerformanceResponse = {
  vault: {
    id: string
    protocol: {
      network: string
    }
    inputToken: {
      symbol: string
    }
    hourlyVaultHistory: InstiVaultsPerformanceDataPoint[]
    dailyVaultHistory: InstiVaultsPerformanceDataPoint[]
    weeklyVaultHistory: InstiVaultsPerformanceDataPoint[]
  }
}
