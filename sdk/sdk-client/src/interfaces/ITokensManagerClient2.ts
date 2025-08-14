import type { Token, ChainId, AddressValue } from '@summerfi/sdk-common'

/**
 * @name ITokensManagerClient
 * @description Interface for the TokensManager client implementation. Allows to retrieve information for
 *              a Token given its Chain, and its Address or symbol. The difference with the server side
 *              is that it stores the chain info internally and passes it as a parameter to the RPC calls
 * @see ITokensManager
 */
export interface ITokensManagerClient2 {
  /**
   * @method getTokenBySymbol
   * @description Retrieves a token by its symbol
   *
   * @param symbol The symbol of the token to retrieve
   *
   * @returns The token with the given symbol
   */
  getTokenBySymbol(params: { symbol: string; chainId: ChainId }): Promise<Token>

  /**
   * @method getTokenByAddress
   * @description Retrieves a token by its address
   *
   * @param address The address of the token to retrieve
   *
   * @returns The token with the given address
   */
  getTokenByAddress(params: { addressValue: AddressValue; chainId: ChainId }): Promise<Token>
}
