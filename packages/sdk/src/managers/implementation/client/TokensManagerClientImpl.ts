import { Address, Token } from '~sdk/common'
import { TokensManager } from '~sdk/managers'
import { Maybe } from '~sdk/utils'

export class TokensManagerClientImpl implements TokensManager {
  public async getSupportedTokens(): Promise<Token[]> {
    // TODO: Implement
    return [] as Token[]
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getTokenBySymbol(symbol: string): Promise<Maybe<Token>> {
    // TODO: Implement
    return undefined
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getTokenByAddress(address: Address): Promise<Maybe<Token>> {
    // TODO: Implement
    return undefined
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getTokenByName(name: string): Promise<Maybe<Token>> {
    // TODO: Implement
    return undefined
  }
}
