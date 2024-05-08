import { AaveV3ProtocolPlugin } from '@summerfi/protocol-plugins/plugins/aave-v3'
import {
  ProtocolPluginsRecordType,
  ProtocolPluginsRegistry,
} from '@summerfi/protocol-plugins/implementation'
import { SparkProtocolPlugin } from '@summerfi/protocol-plugins/plugins/spark'
import { MakerProtocolPlugin } from '@summerfi/protocol-plugins/plugins/maker'
import { MorphoProtocolPlugin } from '@summerfi/protocol-plugins/plugins/morphoblue'

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

/**
 * Protocol plugins record
 *
 * Note: add here the plugins you want to use in the SDK
 */
const ProtocolPlugins: ProtocolPluginsRecordType = {
  [ProtocolName.Maker]: MakerProtocolPlugin,
  [ProtocolName.Spark]: SparkProtocolPlugin,
  [ProtocolName.AAVEv3]: AaveV3ProtocolPlugin,
  [ProtocolName.Morpho]: MorphoProtocolPlugin,
}

/**
 * RPC configuration for the RPC Gateway
 */
const rpcConfig: IRpcConfig = {
  skipCache: false,
  skipMulticall: false,
  skipGraph: true,
  stage: 'prod',
  source: 'borrow-prod',
}

/**
 * Create the protocol plugins registry
 * @param configProvider Configuration provider for environment variables
 * @param deployments Deployment index for the known deployments and dependencies
 * @param tokensManager Tokens manager for fetching known tokens
 * @param oracleManager Oracle manager for fetching prices for tokens
 * @param swapManager Swap manager for quoting swaps and getting calldata for performing swaps
 * @returns
 */
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
