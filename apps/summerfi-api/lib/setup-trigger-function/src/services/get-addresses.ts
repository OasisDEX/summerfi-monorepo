import { ADDRESSES } from '@oasisdex/addresses'
import { ChainId, NetworkByChainID, Address } from '@summerfi/serverless-shared/domain-types'

export interface Addresses {
  AutomationBot: Address
  AaveDataPoolProvider: Address
  AaveOracle: Address
}

export function getAddresses(chainId: ChainId): Addresses {
  const network = NetworkByChainID[chainId]
  const addresses = ADDRESSES[network]

  if (chainId === ChainId.BASE) {
    return {
      AutomationBot: '0x96D494b4544Bb7c3CB687ef7a9886Ed469e01ed8' as Address,
      AaveDataPoolProvider: addresses['aave']['v3'].PoolDataProvider as Address,
      AaveOracle: addresses['aave']['v3'].Oracle as Address,
    }
  }

  return {
    AutomationBot: addresses['automation']['AutomationBotV2'] as Address,
    AaveDataPoolProvider: addresses['aave']['v3'].PoolDataProvider as Address,
    AaveOracle: addresses['aave']['v3'].Oracle as Address,
  }
}
