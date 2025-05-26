import { createPublicClient, defineChain, http, type Chain } from 'viem'
import { arbitrum, base, mainnet, optimism, sonic } from 'viem/chains'

import { IBlockchainClient, IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { ChainIds, type IChainInfo } from '@summerfi/sdk-common'
import { assert } from 'console'
import { getForkUrl } from './getForkUrl'

interface IRpcConfig {
  skipCache: boolean
  skipMulticall: boolean
  skipGraph: boolean
  stage: string
  source: string
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

export function getRpcGatewayEndpoint(
  rpcGatewayUrl: string,
  chainId: number,
  rpcConfig: IRpcConfig,
) {
  const NetworkByChainID: Record<number, string> = {
    [ChainIds.Mainnet]: 'mainnet',
    [ChainIds.ArbitrumOne]: 'arbitrum',
    [ChainIds.Optimism]: 'optimism',
    [ChainIds.Base]: 'base',
    [ChainIds.Sonic]: 'sonic',
  }
  const network = NetworkByChainID[chainId]
  if (!network) {
    throw new Error(`Chain ID ${chainId} is not supported`)
  }

  return (
    `${rpcGatewayUrl}/?` +
    `network=${network}&` +
    `skipCache=${rpcConfig.skipCache}&` +
    `skipMulticall=${rpcConfig.skipMulticall}&` +
    `skipGraph=${rpcConfig.skipGraph}&` +
    `source=${rpcConfig.source}`
  )
}

/**
 * Blockchain client provider implements the IBlockchainClientProvider interface
 * @implements IBlockchainClientProvider
 */
export class BlockchainClientProvider implements IBlockchainClientProvider {
  private readonly _blockchainClients: Record<number, IBlockchainClient> = {}
  private readonly _chains: Record<number, Chain> = {}
  private readonly _configProvider: IConfigurationProvider

  /** CONSTRUCTOR */
  constructor(params: { configProvider: IConfigurationProvider }) {
    this._configProvider = params.configProvider
    this._loadClients([mainnet, optimism, arbitrum, base, sonic])
  }

  /** PUBLIC */

  /** @see IBlockchainClientProvider.getBlockchainClient */
  public getBlockchainClient(params: {
    chainInfo: IChainInfo
    rpcUrl?: string
  }): IBlockchainClient {
    const chain = this._chains[params.chainInfo.chainId]
    if (!chain) {
      throw new Error(`Chain not supported: ${params.chainInfo}`)
    }

    if (params.rpcUrl) {
      const customChain = defineChain({
        ...chain,
        rpcUrls: {
          default: {
            http: [params.rpcUrl],
          },
        },
      })

      return this._createBlockchainClient({ rpcUrl: params.rpcUrl, chain: customChain })
    } else {
      const client = this._blockchainClients[params.chainInfo.chainId]
      assert(
        client,
        'Chain was found for the given chainInfo but the blockchain client was not, this should never happen',
      )
      return client
    }
  }

  /** PRIVATE */

  /**
   * Pre-loads a list of known blockchain clients
   *
   * @param chains List of known chains to be preloaded
   */
  private _loadClients(chains: Chain[]) {
    for (const chain of chains) {
      const rpcGatewayUrl = this._configProvider.getConfigurationItem({ name: 'SDK_RPC_GATEWAY' })
      if (!rpcGatewayUrl) {
        throw new Error('SDK_RPC_GATEWAY not found')
      }

      const useFork = this._configProvider.getConfigurationItem({ name: 'SDK_USE_FORK' })
      const forkConfig = this._configProvider.getConfigurationItem({ name: 'SDK_FORK_CONFIG' })
      let forkRpc = undefined
      if (useFork && forkConfig) {
        forkRpc = getForkUrl(forkConfig, chain.id)
      }

      const rpc = forkRpc ? forkRpc : getRpcGatewayEndpoint(rpcGatewayUrl, chain.id, rpcConfig)
      const transport = http(rpc, {
        batch: true,
        fetchOptions: {
          method: 'POST',
        },
      })

      const client = createPublicClient({
        batch: {
          multicall: true,
        },
        chain,
        transport,
      })

      this._blockchainClients[chain.id] = client
      this._chains[chain.id] = chain
    }
  }

  /**
   * Creates a blockchain client with the given parameters
   *
   * @param rpcUrl RPC URL to be used for this client
   * @param chain Chain for which we want to get the blockchain client
   *
   * @returns The blockchain client
   */
  private _createBlockchainClient(params: { rpcUrl: string; chain: Chain }) {
    const transport = http(params.rpcUrl, {
      batch: true,
      fetchOptions: {
        method: 'POST',
      },
    })

    return createPublicClient({
      batch: {
        multicall: true,
      },
      chain: params.chain,
      transport,
    })
  }
}
