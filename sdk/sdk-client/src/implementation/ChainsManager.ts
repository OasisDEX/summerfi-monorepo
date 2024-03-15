import { ChainInfo, Maybe } from '@summerfi/sdk-common/common'
import { IChainsManager } from '../interfaces/IChainsManager'
import { Chain } from './Chain'
import { TokensManager } from './TokensManager'
import { ProtocolsManager } from './ProtocolsManager'

export class ChainsManager implements IChainsManager {
  public async getSupportedChains(): Promise<ChainInfo[]> {
    // TODO: Implement
    return [] as ChainInfo[]
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getChain(params: { chainInfo: ChainInfo }): Promise<Maybe<Chain>> {
    return new Chain({
      chainInfo: params.chainInfo,
      tokensManager: new TokensManager({ chainInfo: params.chainInfo }),
      protocolsManager: new ProtocolsManager({ chainInfo: params.chainInfo }),
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
