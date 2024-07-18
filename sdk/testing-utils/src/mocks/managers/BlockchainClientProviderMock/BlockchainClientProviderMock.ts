import { BlockchainClientProvider, IBlockchainClient } from '@summerfi/blockchain-client-provider'
import { IConfigurationProvider } from '@summerfi/configuration-provider'
import { IChainInfo } from '@summerfi/sdk-common'

export class BlockchainClientProviderMock extends BlockchainClientProvider {
  public readonly rpcUrl: string

  constructor(params: { configProvider: IConfigurationProvider; rpcUrl: string }) {
    super(params)

    this.rpcUrl = params.rpcUrl
  }

  public getBlockchainClient(params: {
    chainInfo: IChainInfo
    rpcUrl?: string
  }): IBlockchainClient {
    return super.getBlockchainClient({
      rpcUrl: params.rpcUrl ? params.rpcUrl : this.rpcUrl,
      chainInfo: params.chainInfo,
    })
  }
}
