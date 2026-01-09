import { SupportedNetworkIds } from '@summerfi/app-types'

/**
 * Delay per network in milliseconds
 * @description Delay per network in milliseconds
 */
export const delayPerNetwork = {
  [SupportedNetworkIds.Base]: 4000,
  [SupportedNetworkIds.ArbitrumOne]: 4000,
  [SupportedNetworkIds.Mainnet]: 13000,
  [SupportedNetworkIds.SonicMainnet]: 4000,
  [SupportedNetworkIds.Hyperliquid]: 4000,
} as const
