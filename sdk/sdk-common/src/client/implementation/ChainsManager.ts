import type { IChainsManager } from '~sdk-common/client/interfaces/IChainsManager'
import type { ChainInfo } from '~sdk-common/common/implementation/ChainInfo'
import type { Maybe } from '~sdk-common/common/aliases'
import { ProtocolsManager } from '~sdk-common/client/implementation/ProtocolsManager'
import { TokensManager } from '~sdk-common/client/implementation/TokensManager'
import { Chain } from '~sdk-common/client/implementation/Chain'

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
