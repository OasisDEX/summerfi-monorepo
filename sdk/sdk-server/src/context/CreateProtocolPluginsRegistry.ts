import { AaveV3ProtocolPlugin } from '@summerfi/protocol-plugins/plugins/aave-v3'
import {
  ProtocolPluginsRecordType,
  ProtocolPluginsRegistry,
} from '@summerfi/protocol-plugins/implementation'
import { SparkProtocolPlugin } from '@summerfi/protocol-plugins/plugins/spark'
import { MakerProtocolPlugin } from '@summerfi/protocol-plugins/plugins/maker'

import { IProtocolPluginsRegistry } from '@summerfi/protocol-plugins-common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { DeploymentIndex } from '@summerfi/deployment-utils'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import {
  IRpcConfig,
  getRpcGatewayEndpoint,
} from '@summerfi/serverless-shared/getRpcGatewayEndpoint'
import { ConfigurationProvider } from '@summerfi/configuration-provider'
import { ITokensManager } from '@summerfi/tokens-common'
import { IOracleManager } from '@summerfi/oracle-common'

const ProtocolPlugins: ProtocolPluginsRecordType = {
  [ProtocolName.Maker]: MakerProtocolPlugin,
  [ProtocolName.Spark]: SparkProtocolPlugin,
  [ProtocolName.AAVEv3]: AaveV3ProtocolPlugin,
}

const rpcConfig: IRpcConfig = {
  skipCache: false,
  skipMulticall: false,
  skipGraph: true,
  stage: 'prod',
  source: 'borrow-prod',
}

export function createProtocolsPluginsRegistry(params: {
  configProvider: ConfigurationProvider
  deployments: DeploymentIndex
  tokensManager: ITokensManager
  oracleManager: IOracleManager
  swapManager: ISwapManager
}): IProtocolPluginsRegistry {
  const { configProvider, deployments, swapManager, tokensManager, oracleManager } = params
  const chain = mainnet
  const rpcGatewayUrl = configProvider.getConfigurationItem({ name: 'RPC_GATEWAY' })
  if (!rpcGatewayUrl) {
    throw new Error('RPC_GATEWAY not found')
  }

  const rpc = getRpcGatewayEndpoint(rpcGatewayUrl, chain.id, rpcConfig)
  const transport = http(rpc, {
    batch: true,
    fetchOptions: {
      method: 'POST',
    },
  })
  const provider = createPublicClient({
    batch: {
      multicall: true,
    },
    chain,
    transport,
  })

  return new ProtocolPluginsRegistry({
    plugins: ProtocolPlugins,
    context: {
      deployments,
      provider,
      tokensManager,
      oracleManager,
      swapManager,
    },
    deploymentConfigTag: 'standard',
  })
}
