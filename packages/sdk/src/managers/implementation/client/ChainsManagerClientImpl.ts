import { ChainManager } from '~sdk/managers'
import { Chain, ChainInfo } from '~sdk/chain'
import { Maybe } from '~sdk/utils'

export class ChainsManagerClientImpl implements ChainManager {
  public async getSupportedChains(): Promise<ChainInfo[]> {
    // TODO: Implement
    return [] as ChainInfo[]
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getChainByName(name: string): Promise<Maybe<Chain>> {
    // TODO: Implement
    return undefined
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getChainByChainId(chainId: number): Promise<Maybe<Chain>> {
    // TODO: Implement
    return undefined
  }
}
