import type { IChainInfo, IAddress, IToken } from '@summerfi/sdk-common/common'
import { TokensProviderType } from '@summerfi/sdk-common/tokens'
import { IManagerWithProviders } from '@summerfi/sdk-server-common'
import { ITokensProvider } from './ITokensProvider'

/**
 * @name ITokensManager
 * @description Interface for the TokensManager. Allows to retrieve information for a Token given its Chain, and
 *              its Address or symbol
 */
export interface ITokensManager extends IManagerWithProviders<TokensProviderType, ITokensProvider> {
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
