import { ChainId } from '@summerfi/sdk-common'
import { IAddress, IChainInfo, IToken } from '@summerfi/sdk-common/common'
import { TokensProviderType } from '@summerfi/sdk-common/tokens'
import { IManagerProvider } from '@summerfi/sdk-server-common'

/**
 * @name ITokensProvider
 * @description Interface for providers of token information
 */
export interface ITokensProvider extends IManagerProvider<TokensProviderType> {
  /**
   * @name type
   * @description The type of the tokens provider, used to identify the provider
   */
  type: TokensProviderType

  /**
   * @method getSupportedChainIds
   * @description Retrieves the list of supported chain IDs
   * @returns The list of supported chain IDs
   */
  getSupportedChainIds(): ChainId[]

  /**
   * @method getTokenBySymbol
   * @description Retrieves a token by its symbol
   *
   * @param chainInfo The chain information of the token to retrieve
   * @param symbol The symbol of the token to retrieve
   *
   * @returns The token with the given symbol
   */
  getTokenBySymbol(params: { chainInfo: IChainInfo; symbol: string }): IToken

  /**
   * @method getTokenByAddress
   * @description Retrieves a token by its address
   *
   * @param chainInfo The chain information of the token to retrieve
   * @param address The address of the token to retrieve
   *
   * @returns The token with the given address
   */
  getTokenByAddress(params: { chainInfo: IChainInfo; address: IAddress }): IToken

  /**
   * @method getTokenByName
   * @description Retrieves a token by its name
   *
   * @param chainInfo The chain information of the token to retrieve
   * @param name The name of the token to retrieve
   *
   * @returns The token with the given name
   */
  getTokenByName(params: { chainInfo: IChainInfo; name: string }): IToken
}
