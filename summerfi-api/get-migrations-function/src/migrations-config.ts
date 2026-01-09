import { ChainId, ProtocolId } from '@summerfi/serverless-shared'

export type IMigrationConfig = Record<ChainId, ProtocolId[]>

/**
 * MigrationConfig is a map of supported protocols per chain
 */
export const MigrationConfig: IMigrationConfig = {
  [ChainId.MAINNET]: [ProtocolId.AAVE_V3, ProtocolId.SPARK],
  [ChainId.ARBITRUM]: [ProtocolId.AAVE_V3],
  [ChainId.OPTIMISM]: [ProtocolId.AAVE_V3],
  [ChainId.BASE]: [ProtocolId.AAVE_V3],
  [ChainId.SEPOLIA]: [],
  [ChainId.SONIC]: [],
  [ChainId.HYPERLIQUID]: [],
}
