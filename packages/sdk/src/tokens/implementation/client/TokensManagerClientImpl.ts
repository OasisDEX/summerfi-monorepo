import { ChainInfo } from '~sdk/chains'
import { Address, Token } from '~sdk/common'
import { getMockTokenBySymbol } from '~sdk/mocks'
import { TokensManager, type TokenSymbol } from '~sdk/tokens'
import { Maybe } from '~sdk/utils'

export class TokensManagerClientImpl implements TokensManager {
  private readonly chainInfo: ChainInfo

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public constructor(params: { chainInfo: ChainInfo }) {
    // TODO: load the list of tokens for the chain indicated by chainInfo
    this.chainInfo = params.chainInfo
  }

  public async getSupportedTokens(): Promise<Token[]> {
    // TODO: Implement
    return [] as Token[]
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getTokenBySymbol(params: { symbol: TokenSymbol }): Promise<Maybe<Token>> {
    // TODO: Implement
    return getMockTokenBySymbol({ chainInfo: this.chainInfo, symbol: params.symbol })
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getTokenByAddress(params: { address: Address }): Promise<Maybe<Token>> {
    // TODO: Implement
    return undefined
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getTokenByName(params: { name: string }): Promise<Maybe<Token>> {
    // TODO: Implement
    return undefined
  }
}
