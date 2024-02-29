import type { ITokensManager } from '~sdk-common/client/interfaces/ITokensManager'
import type { TokenSymbol } from '~sdk-common/common/enums'
import { Address, Token, type ChainInfo } from '~sdk-common/common/implementation'
import { getMockTokenBySymbol } from '~sdk-common/mocks'
import type { Maybe } from '~sdk-common/common/aliases'

export class TokensManager implements ITokensManager {
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
  public async getTokenByAddress(_params: { address: Address }): Promise<Maybe<Token>> {
    // TODO: Implement
    return undefined
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getTokenByName(_params: { name: string }): Promise<Maybe<Token>> {
    // TODO: Implement
    return undefined
  }
}
