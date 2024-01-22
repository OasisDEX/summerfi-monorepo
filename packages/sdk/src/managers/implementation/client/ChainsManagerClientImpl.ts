import { ChainManager } from '~sdk/managers'
import { Chain, ChainInfo } from '~sdk/chain'
import { Maybe } from '~sdk/utils'

export class ChainsManagerClientImpl implements ChainManager {
  public async getSupportedChains(): Promise<ChainInfo[]> {
    // TODO: Implement
    return [] as ChainInfo[]
  }

  public async getChainByName(name: string): Promise<Maybe<Chain>> {
    // TODO: Implement
    return undefined
  }

  public async getChainByChainId(chainId: number): Promise<Maybe<Chain>> {
    // TODO: Implement
    return undefined
  }
}
