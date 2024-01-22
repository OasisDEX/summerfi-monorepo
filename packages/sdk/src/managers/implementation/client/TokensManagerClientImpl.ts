import { Address, Token } from '~sdk/common'
import { TokensManager } from '~sdk/managers'
import { Maybe } from '~sdk/utils'

export class TokensManagerClientImpl implements TokensManager {
  public async getSupportedTokens(): Promise<Token[]> {
    // TODO: Implement
    return [] as Token[]
  }

  public async getTokenBySymbol(symbol: string): Promise<Maybe<Token>> {
    // TODO: Implement
    return undefined
  }

  public async getTokenByAddress(address: Address): Promise<Maybe<Token>> {
    // TODO: Implement
    return undefined
  }
  public async getTokenByName(name: string): Promise<Maybe<Token>> {
    // TODO: Implement
    return undefined
  }
}
