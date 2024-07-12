import { createPublicClient, http, type Chain } from 'viem'
import { arbitrum, base, mainnet, optimism } from 'viem/chains'

import { IConfigurationProvider } from '@summerfi/configuration-provider'
import type { IChainInfo } from '@summerfi/sdk-common'
import {
  IRpcConfig,
  getRpcGatewayEndpoint,
} from '@summerfi/serverless-shared/getRpcGatewayEndpoint'
import type { IBlockchainClient } from '../interfaces/IBlockchainClient'
import { IBlockchainClientProvider } from '../interfaces'

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

  constructor(params: { configProvider: IConfigurationProvider }) {
    this._configProvider = params.configProvider
    this._loadClients([mainnet, optimism, arbitrum, base])
  }

  public getBlockchainClient(params: { chainInfo: IChainInfo }): IBlockchainClient {
    const provider = this._blockchainClients[params.chainInfo.chainId]
    if (!provider) {
      throw new Error('Provider not found')
    }
    return provider
  }

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
}
