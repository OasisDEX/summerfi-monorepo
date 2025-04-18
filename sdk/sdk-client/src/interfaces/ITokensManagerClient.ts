import type { Token, Address } from '@summerfi/sdk-common'

/**
 * @name ITokensManagerClient
 * @description Interface for the TokensManager client implementation. Allows to retrieve information for
 *              a Token given its Chain, and its Address or symbol. The difference with the server side
 *              is that it stores the chain info internally and passes it as a parameter to the RPC calls
 * @see ITokensManager
 */
export interface ITokensManagerClient {
  /**
   * @method getTokenBySymbol
   * @description Retrieves a token by its symbol
   *
   * @param symbol The symbol of the token to retrieve
   *
   * @returns The token with the given symbol
   */
  getTokenBySymbol(params: { symbol: string }): Promise<Token>

  /**
   * @method getTokenByAddress
   * @description Retrieves a token by its address
   *
   * @param address The address of the token to retrieve
   *
   * @returns The token with the given address
   */
  getTokenByAddress(params: { address: Address }): Promise<Token>

  /**
   * @method getTokenByName
   * @description Retrieves a token by its name
   *
   * @param name The name of the token to retrieve
   *
   * @returns The token with the given name
   */
  getTokenByName(params: { name: string }): Promise<Token>
}
