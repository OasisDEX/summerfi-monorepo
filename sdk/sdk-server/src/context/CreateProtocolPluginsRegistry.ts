import { ProtocolPluginsRecord, ProtocolPluginsRegistry } from '@summerfi/protocol-plugins'
import { IProtocolPluginsRegistry } from '@summerfi/protocol-plugins-common'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import {
  IRpcConfig,
  getRpcGatewayEndpoint,
} from '@summerfi/serverless-shared/getRpcGatewayEndpoint'
import { ConfigurationProvider } from '@summerfi/configuration-provider'
import { ITokensManager } from '@summerfi/tokens-common'
import { IOracleManager } from '@summerfi/oracle-common'
import { IAddressBookManager } from '@summerfi/address-book-common'

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
  tokensManager: ITokensManager
  oracleManager: IOracleManager
  swapManager: ISwapManager
  addressBookManager: IAddressBookManager
}): IProtocolPluginsRegistry {
  const { configProvider, addressBookManager, swapManager, tokensManager, oracleManager } = params
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
    plugins: ProtocolPluginsRecord,
    context: {
      provider,
      tokensManager,
      oracleManager,
      swapManager,
      addressBookManager,
    },
  })
}
