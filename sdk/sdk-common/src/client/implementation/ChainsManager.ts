import { Chain } from '~sdk-common/client/implementation'
import type { IChainsManager } from '~sdk-common/client/interfaces/IChainsManager'
import type { ChainInfo } from '~sdk-common/common/implementation'
import { Maybe } from '~sdk-common/utils'

export class ChainsManager implements IChainsManager {
  public async getSupportedChains(): Promise<ChainInfo[]> {
    // TODO: Implement
    return [] as ChainInfo[]
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getChain(params: { chainInfo: ChainInfo }): Promise<Maybe<Chain>> {
    return new Chain({
      chainInfo: params.chainInfo,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tokensManager: undefined as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      protocolsManager: undefined as any,
    })
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getChainByName(params: { name: string }): Promise<Maybe<Chain>> {
    // TODO: Implement
    return undefined
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getChainById(params: { chainId: number }): Promise<Maybe<Chain>> {
    // TODO: Implement
    return undefined
  }
}
