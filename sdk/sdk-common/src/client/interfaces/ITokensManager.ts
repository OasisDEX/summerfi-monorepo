import { Address, Token } from '~sdk-common/common/implementation'
import { Maybe } from '~sdk-common/utils'

/**
 * @interface ITokensManager
 * @description Used to retrieve the supported tokens for the current network. It also allows to retrieve a token
 *              by its symbol, address or name
 */
export interface ITokensManager {
  /**
   * @method getSupportedTokens
   * @description Retrieves the list supported tokens for the current network
   *
   * @returns The list of supported tokens
   */
  getSupportedTokens(): Promise<Token[]>

  /**
   * @method getTokenBySymbol
   * @description Retrieves a token by its symbol
   *
   * @param symbol The symbol of the token to retrieve
   *
   * @returns The token with the given symbol
   */
  getTokenBySymbol(params: { symbol: string }): Promise<Maybe<Token>>

  /**
   * @method getTokenByAddress
   * @description Retrieves a token by its address
   *
   * @param address The address of the token to retrieve
   *
   * @returns The token with the given address
   */
  getTokenByAddress(params: { address: Address }): Promise<Maybe<Token>>

  /**
   * @method getTokenByName
   * @description Retrieves a token by its name
   *
   * @param name The name of the token to retrieve
   *
   * @returns The token with the given name
   */
  getTokenByName(params: { name: string }): Promise<Maybe<Token>>
}
