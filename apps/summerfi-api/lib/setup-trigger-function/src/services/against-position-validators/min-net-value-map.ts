import { ChainId, ProtocolId } from '@summerfi/serverless-shared'
import { Price, PRICE_DECIMALS } from '~types'

export const minNetValueMap: Record<ChainId, Record<ProtocolId, Price>> = {
  [ChainId.MAINNET]: {
    [ProtocolId.AAVE3]: 10_000n * 10n ** PRICE_DECIMALS,
    [ProtocolId.SPARK]: 10_000n * 10n ** PRICE_DECIMALS,
  },
  [ChainId.BASE]: {
    [ProtocolId.AAVE3]: 100n * 10n ** PRICE_DECIMALS,
    [ProtocolId.SPARK]: 100n * 10n ** PRICE_DECIMALS,
  },
  [ChainId.ARBITRUM]: {
    [ProtocolId.AAVE3]: 100n * 10n ** PRICE_DECIMALS,
    [ProtocolId.SPARK]: 100n * 10n ** PRICE_DECIMALS,
  },
  [ChainId.OPTIMISM]: {
    [ProtocolId.AAVE3]: 100n * 10n ** PRICE_DECIMALS,
    [ProtocolId.SPARK]: 1000n * 10n ** PRICE_DECIMALS,
  },
  [ChainId.SEPOLIA]: {
    [ProtocolId.AAVE3]: 10_000n * 10n ** PRICE_DECIMALS,
    [ProtocolId.SPARK]: 10_000n * 10n ** PRICE_DECIMALS,
  },
}
