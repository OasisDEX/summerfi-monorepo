import { AaveV3ProtocolPlugin } from '@summerfi/protocol-plugins/plugins/aave-v3'
import { MockContractProvider } from '@summerfi/protocol-plugins/mocks'
import {
  PriceService,
  ProtocolPluginsRecordType,
  ProtocolPluginsRegistry,
  TokenService,
} from '@summerfi/protocol-plugins/implementation'
import { SparkProtocolPlugin } from '@summerfi/protocol-plugins/plugins/spark'
import { MakerProtocolPlugin } from '@summerfi/protocol-plugins/plugins/maker'

import { IProtocolPluginsRegistry } from '@summerfi/protocol-plugins-common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const ProtocolPlugins: ProtocolPluginsRecordType = {
  [ProtocolName.Maker]: MakerProtocolPlugin,
  [ProtocolName.Spark]: SparkProtocolPlugin,
  [ProtocolName.AAVEv3]: AaveV3ProtocolPlugin,
}

export function createProtocolsPluginsRegistry(): IProtocolPluginsRegistry {
  const provider = createPublicClient({
    batch: {
      multicall: true,
    },
    chain: mainnet,
    transport: http(),
  })

  const tokenService = new TokenService()
  const priceService = new PriceService(provider)
  const contractProvider = new MockContractProvider()

  return new ProtocolPluginsRegistry({
    plugins: ProtocolPlugins,
    context: {
      provider,
      tokenService,
      priceService,
      contractProvider,
    },
  })
}
