import { createPublicClient, defineChain, http, type Chain } from 'viem'
import { arbitrum, base, mainnet, optimism } from 'viem/chains'

import { IConfigurationProvider } from '@summerfi/configuration-provider'
import type { IChainInfo } from '@summerfi/sdk-common'
import {
  IRpcConfig,
  getRpcGatewayEndpoint,
} from '@summerfi/serverless-shared/getRpcGatewayEndpoint'
import { IBlockchainClientProvider } from '../interfaces'
import type { IBlockchainClient } from '../interfaces/IBlockchainClient'

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
 * Blockchain client provider implements the IBlockchainClientProvider interface
 * @implements IBlockchainClientProvider
 */
export class BlockchainClientProvider implements IBlockchainClientProvider {
  private readonly _blockchainClients: Record<number, IBlockchainClient> = {}
  private readonly _configProvider: IConfigurationProvider

  /** CONSTRUCTOR */
  constructor(params: { configProvider: IConfigurationProvider }) {
    this._configProvider = params.configProvider
    this._loadClients([mainnet, optimism, arbitrum, base])
  }

  /** PUBLIC */

  /** @see IBlockchainClientProvider.getBlockchainClient */
  public getBlockchainClient(params: { chainInfo: IChainInfo }): IBlockchainClient {
    const provider = this._blockchainClients[params.chainInfo.chainId]
    if (!provider) {
      throw new Error('Provider not found')
    }
    return provider
  }

  /** @see IBlockchainClientProvider.getCustomBlockchainClient */
  public getCustomBlockchainClient(params: {
    rpcUrl: string
    chainInfo: IChainInfo
  }): IBlockchainClient {
    const chain = defineChain({
      id: params.chainInfo.chainId,
      name: params.chainInfo.name,
      nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
      },
      rpcUrls: {
        default: {
          http: [params.rpcUrl],
        },
      },
      blockExplorers: {
        default: { name: 'Explorer', url: '' },
      },
    })

    return this._createBlockchainClient({ rpcUrl: params.rpcUrl, chain })
  }

  /** PRIVATE */

  /**
   * Pre-loads a list of known blockchain clients
   *
   * @param chains List of known chains to be preloaded
   */
  private _loadClients(chains: Chain[]) {
    for (const chain of chains) {
      const rpcGatewayUrl = this._configProvider.getConfigurationItem({ name: 'RPC_GATEWAY' })
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

      const client = createPublicClient({
        batch: {
          multicall: true,
        },
        chain,
        transport,
      })

      this._blockchainClients[chain.id] = client
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
