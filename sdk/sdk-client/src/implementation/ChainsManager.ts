import type { ChainInfo, Maybe } from '@summerfi/sdk-common/common'
import { Chain } from '~sdk-client/implementation/Chain'
import { ProtocolsManager } from '~sdk-client/implementation/ProtocolsManager'
import { TokensManager } from '~sdk-client/implementation/TokensManager'
import type { IChainsManager } from '~sdk-client/interfaces/IChainsManager'

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
