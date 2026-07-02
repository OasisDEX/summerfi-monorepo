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
 * Implementation of the IChainsManager interface for the SDK Client
 */
export class ChainsManagerClient extends IRPCClient implements IChainsManagerClient {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /**
   * Builds a {@link Chain} instance (with its tokens and protocols managers) from chain info.
   *
   * @param params - Parameters object.
   * @param params.chainInfo - Identifying information of the chain to build.
   * @returns A promise resolving to the configured {@link Chain}.
   */
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

  /**
   * Builds a {@link Chain} instance by resolving chain info from a numeric chain id.
   *
   * @param params - Parameters object.
   * @param params.chainId - The numeric id of the chain to build.
   * @returns A promise resolving to the configured {@link Chain}.
   */
  public async getChainById(params: { chainId: number }): Promise<Chain> {
    const chainFamily = getChainFamilyInfoByChainId(params.chainId)

    return this.getChain({ chainInfo: chainFamily.chainInfo })
  }
}
