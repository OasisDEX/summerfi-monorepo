import { ChainInfo, IChainInfoData, Maybe } from '@summerfi/sdk-common/common'
import { IChainsManagerClient } from '../interfaces/IChainsManager'
import { Chain } from './Chain'
import { TokensManagerClient } from './TokensManagerClient'
import { ProtocolsManagerClient } from './ProtocolsManagerClient'
import { RPCClientType } from '../rpc/SDKClient'
import { IRPCClient } from '../interfaces/IRPCClient'

/**
 * @name ChainsManagerClient
 * @description Implementation of the IChainsManager interface for the SDK Client
 */
export class ChainsManagerClient extends IRPCClient implements IChainsManagerClient {
  constructor(params: { rpcClient: RPCClientType }) {
    super(params)
  }

  public async getSupportedChains(): Promise<ChainInfo[]> {
    // TODO: Implement
    return [] as ChainInfo[]
  }

  public async getChain(params: { chainInfo: IChainInfoData }): Promise<Maybe<Chain>> {
    const chainInfo = ChainInfo.createFrom(params.chainInfo)

    return new Chain({
      chainInfo: chainInfo,
      tokensManager: new TokensManagerClient({ rpcClient: this.rpcClient, chainInfo: chainInfo }),
      protocolsManager: new ProtocolsManagerClient({
        rpcClient: this.rpcClient,
        chainInfo: chainInfo,
      }),
    })
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getChainByName(_params: { name: string }): Promise<Maybe<Chain>> {
    // TODO: Implement
    return undefined
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getChainById(_params: { chainId: number }): Promise<Maybe<Chain>> {
    // TODO: Implement
    return undefined
  }
}
