import { ChainsManager } from '~sdk/chains'
import { Chain, ChainInfo } from '~sdk/chains'
import { Maybe } from '~sdk/utils'

export class ChainsManagerClientImpl implements ChainsManager {
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
