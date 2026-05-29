export enum VaultsSorting {
  HIGHEST_APY = 'highest-apy',
  HIGHEST_REWARDS = 'highest-rewards',
  HIGHEST_TVL = 'highest-tvl',
}

export type VaultMetrics = {
  apy: number
  rawTokenBonus: number
}

// Precomputed apy + reward-token bonus per vault, keyed by unique vault id.
export type VaultMetricsMap = Map<string, VaultMetrics>
