import { ChainInfo, Maybe } from '@summerfi/sdk-common/common'
import { IChainsManager } from '../interfaces/IChainsManager'
import { Chain } from './Chain'
import { TokensManager } from './TokensManager'
import { ProtocolsManager } from './ProtocolsManager'
import { RPCClientType } from '../rpc/SDKClient'
import { IRPCClient } from '../interfaces/IRPCClient'

export class ChainsManager extends IRPCClient implements IChainsManager {
  constructor(params: { rpcClient: RPCClientType }) {
    super(params)
  }

  public async getSupportedChains(): Promise<ChainInfo[]> {
    // TODO: Implement
    return [] as ChainInfo[]
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getChain(params: { chainInfo: ChainInfo }): Promise<Maybe<Chain>> {
    return new Chain({
      chainInfo: params.chainInfo,
      tokensManager: new TokensManager({ rpcClient: this.rpcClient, chainInfo: params.chainInfo }),
      protocolsManager: new ProtocolsManager({
        rpcClient: this.rpcClient,
        chainInfo: params.chainInfo,
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
