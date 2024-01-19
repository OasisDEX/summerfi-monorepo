import { Address, Token } from '~sdk/common'
import { TokensManager } from '~sdk/managers'
import { Maybe } from '~sdk/utils'

/**
 * @class TokensManagerClientImpl
 * @description Client implementation for the TokensManager
 * @see TokensManager
 */
export class TokensManagerClientImpl implements TokensManager {
  /// Class Attributes
  private static _instance: TokensManagerClientImpl

  /// Constructor
  private constructor() {}

  /// Instance Methods

  /**
   * @method getSupportedTokens
   * @see TokensManager#getSupportedTokens
   */
  public async getSupportedTokens(): Promise<Token[]> {
    // TODO: Implement
    return [] as Token[]
  }

  /**
   * @method getTokenBySymbol
   * @see TokensManager#getTokenBySymbol
   */
  public async getTokenBySymbol(symbol: string): Promise<Maybe<Token>> {
    // TODO: Implement
    return undefined
  }

  /**
   * @method getTokenByAddress
   * @see TokensManager#getTokenByAddress
   */
  public async getTokenByAddress(address: Address): Promise<Maybe<Token>> {
    // TODO: Implement
    return undefined
  }

  /**
   * @method getTokenByName
   * @see TokensManager#getTokenByName
   */
  public async getTokenByName(name: string): Promise<Maybe<Token>> {
    // TODO: Implement
    return undefined
  }

  /// Static Methods

  public static getInstance(): TokensManagerClientImpl {
    if (!this._instance) {
      this._instance = new TokensManagerClientImpl()
    }
    return this._instance
  }
}
