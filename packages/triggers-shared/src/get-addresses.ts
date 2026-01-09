import { ADDRESSES } from '@oasisdex/addresses'
import {
  ChainId,
  NetworkByChainID,
  Address,
  Network,
} from '@summerfi/serverless-shared/domain-types'

export interface Addresses {
  AutomationBot: Address
  AaveV3: {
    AaveDataPoolProvider: Address
    AaveOracle: Address
  }
  Spark: {
    SparkDataPoolProvider: Address
    SparkOracle: Address
  }
  MorphoBlue: {
    MorphoBlue: Address
    AdaptiveCurveIrm: Address
  }
}

export function getAddresses(chainId: ChainId): Addresses {
  const network = NetworkByChainID[chainId]
  if (network === Network.SONIC) {
    throw new Error('Sonic is not supported yet')
  }
  if (network === Network.HYPERLIQUID) {
    throw new Error('Hyperliquid is not supported yet')
  }
  const addresses = ADDRESSES[network]

  return {
    AutomationBot: addresses['automation']['AutomationBotV2'] as Address,
    AaveV3: {
      AaveDataPoolProvider: addresses['aave']['v3'].PoolDataProvider as Address,
      AaveOracle: addresses['aave']['v3'].Oracle as Address,
    },
    Spark: {
      SparkDataPoolProvider: addresses['spark'].PoolDataProvider as Address,
      SparkOracle: addresses['spark'].Oracle as Address,
    },
    MorphoBlue: {
      MorphoBlue: addresses['morphoblue']['MorphoBlue'] as Address,
      AdaptiveCurveIrm: addresses['morphoblue']['AdaptiveCurveIrm'] as Address,
    },
  }
}
