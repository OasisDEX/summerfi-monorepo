import { AaveV3ProtocolPlugin } from '@summerfi/protocol-plugins/plugins/aave-v3'
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
import { DeploymentIndex } from '@summerfi/deployment-utils'
import { ISwapManager } from '@summerfi/swap-common/interfaces'

const ProtocolPlugins: ProtocolPluginsRecordType = {
  [ProtocolName.Maker]: MakerProtocolPlugin,
  [ProtocolName.Spark]: SparkProtocolPlugin,
  [ProtocolName.AAVEv3]: AaveV3ProtocolPlugin,
}

export function createProtocolsPluginsRegistry(params: {
  deployments: DeploymentIndex
  swapManager: ISwapManager
}): IProtocolPluginsRegistry {
  const { deployments, swapManager } = params

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
      deployments,
      swapManager,
    },
    deploymentConfigTag: 'standard',
  })
}
