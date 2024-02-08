import { ChainClientImpl, ChainsManager } from '~sdk/chains'
import { Chain, ChainInfo } from '~sdk/chains'
import { Maybe } from '~sdk/utils'

export class ChainsManagerClientImpl implements ChainsManager {
  public async getSupportedChains(): Promise<ChainInfo[]> {
    // TODO: Implement
    return [] as ChainInfo[]
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getChain(params: { chainInfo: ChainInfo }): Promise<Maybe<Chain>> {
    return new ChainClientImpl({
      chainInfo: params.chainInfo,
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
