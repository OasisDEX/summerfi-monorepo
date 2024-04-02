import {
  AaveV3ProtocolPlugin,
  MakerProtocolPlugin,
  PriceService,
  ProtocolPluginsRecordType,
  ProtocolPluginsRegistry,
  SparkProtocolPlugin,
  TokenService,
} from '@summerfi/protocol-plugins'
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

  return new ProtocolPluginsRegistry({
    plugins: ProtocolPlugins,
    context: {
      provider,
      tokenService,
      priceService,
    },
  })
}
