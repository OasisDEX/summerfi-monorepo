import {
  getChainFamilyInfoByChainId,
  ChainIds,
  ChainInfo,
  getChainInfoByChainId,
  IChainInfoData,
} from '@summerfi/sdk-common'
import { IChainsManagerClient } from '../interfaces/IChainsManager'
import { IRPCClient } from '../interfaces/IRPCClient'
import { RPCMainClientType } from '../rpc/SDKMainClient'
import { Chain } from './Chain'
import { ProtocolsManagerClient } from './ProtocolsManagerClient'
import { TokensManagerClient } from './TokensManagerClient'

/**
 * @name ChainsManagerClient
 * @description Implementation of the IChainsManager interface for the SDK Client
 */
export class ChainsManagerClient extends IRPCClient implements IChainsManagerClient {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  public async getSupportedChains(): Promise<ChainInfo[]> {
    return Object.values(ChainIds).map((chainId) => {
      return getChainInfoByChainId(chainId)
    })
  }

  public async getChain(params: { chainInfo: IChainInfoData }): Promise<Chain> {
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

  public async getChainById(params: { chainId: number }): Promise<Chain> {
    const chainFamily = getChainFamilyInfoByChainId(params.chainId)

    return this.getChain({ chainInfo: chainFamily.chainInfo })
  }
}
