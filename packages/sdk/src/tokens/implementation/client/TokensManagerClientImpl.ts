import { ChainInfo } from '~sdk'
import { Address, Token } from '~sdk/common'
import { TokensManager } from '~sdk/tokens'
import { Maybe } from '~sdk/utils'

export class TokensManagerClientImpl implements TokensManager {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public constructor(params: { chainInfo: ChainInfo }) {
    // TODO: load the list of tokens for the chain indicated by chainInfo
  }

  public async getSupportedTokens(): Promise<Token[]> {
    // TODO: Implement
    return [] as Token[]
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getTokenBySymbol(params: { symbol: string }): Promise<Maybe<Token>> {
    // TODO: Implement
    return undefined
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
