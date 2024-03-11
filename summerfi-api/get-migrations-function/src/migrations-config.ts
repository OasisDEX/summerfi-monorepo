import { ChainId, ProtocolId } from '@summerfi/serverless-shared'

export type IMigrationConfig = Record<ChainId, ProtocolId[]>

/**
 * MigrationConfig is a map of supported protocols per chain
 */
export const MigrationConfig: IMigrationConfig = {
  [ChainId.MAINNET]: [ProtocolId.AAVE3, ProtocolId.SPARK],
  [ChainId.ARBITRUM]: [ProtocolId.AAVE3],
  [ChainId.OPTIMISM]: [ProtocolId.AAVE3],
  [ChainId.BASE]: [ProtocolId.AAVE3],
  [ChainId.SEPOLIA]: [],
}
