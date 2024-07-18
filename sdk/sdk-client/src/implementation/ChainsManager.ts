import { ChainInfo, IChainInfoData, Maybe } from '@summerfi/sdk-common/common'
import { IChainsManagerClient } from '../interfaces/IChainsManager'
import { Chain } from './Chain'
import { TokensManagerClient } from './TokensManagerClient'
import { ProtocolsManagerClient } from './ProtocolsManagerClient'
import { RPCMainClientType } from '../rpc/SDKMainClient'
import { IRPCClient } from '../interfaces/IRPCClient'
import { EarnProtocolManagerClient } from './EarnProtocolManagerClient'
import { getChainInfoByChainId } from '@summerfi/sdk-common'

/**
 * @name ChainsManagerClient
 * @description Implementation of the IChainsManager interface for the SDK Client
 */
export class ChainsManagerClient extends IRPCClient implements IChainsManagerClient {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  public async getSupportedChains(): Promise<ChainInfo[]> {
    // TODO: Implement
    throw new Error('Method not implemented.')
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
      earnProtocolManager: new EarnProtocolManagerClient({
        rpcClient: this.rpcClient,
        chainInfo: chainInfo,
      }),
    })
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getChainByName(params: { name: string }): Promise<Maybe<Chain>> {
    // TODO: Implement
    throw new Error('Method not implemented.')
  }

  public async getChainById(params: { chainId: number }): Promise<Maybe<Chain>> {
    const chainFamily = getChainInfoByChainId(params.chainId)
    if (chainFamily == null) {
      throw new Error('Unsupported chainId: ' + params.chainId)
    }
    return this.getChain({ chainInfo: chainFamily.chainInfo })
  }
}
