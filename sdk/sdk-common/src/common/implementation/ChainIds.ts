/** Numeric chain ids of the networks currently supported by the SDK, keyed by network name. */
export const ChainIds = {
  Mainnet: 1,
  Base: 8453,
  ArbitrumOne: 42161,
  Sonic: 146,
  Hyperliquid: 999,
} as const

/** Numeric chain ids of the legacy (pre-Armada) supported networks, keyed by network name. */
export const LegacyChainIds = {
  Mainnet: 1,
  Base: 8453,
  ArbitrumOne: 42161,
  Sonic: 146,
  Optimism: 10, // This is not supported yet
} as const
