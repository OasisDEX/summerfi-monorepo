import { TokensProviderType } from '@summerfi/sdk-common'
import { ITokensManager, ITokensProvider } from '@summerfi/tokens-common'
import { ManagerWithProvidersBase } from '@summerfi/sdk-server-common'

/**
 * @name TokensManager
 * @description Implementation of the ITokensManager interface. It allows to retrieve information for a Token
 */
export class TokensManager
  extends ManagerWithProvidersBase<TokensProviderType, ITokensProvider>
  implements ITokensManager
{
  /** CONSTRUCTOR */
  constructor(params: { providers: ITokensProvider[] }) {
    super(params)
  }

  /** PUBLIC METHODS */

  /** @see ITokensManager.getTokenBySymbol */
  getTokenBySymbol(
    params: Parameters<ITokensManager['getTokenBySymbol']>[0],
  ): ReturnType<ITokensManager['getTokenBySymbol']> {
    const provider = this._getBestProvider({ chainInfo: params.chainInfo })
    return provider.getTokenBySymbol(params)
  }

  /** @see ITokensManager.getTokenByAddress */
  getTokenByAddress(
    params: Parameters<ITokensManager['getTokenByAddress']>[0],
  ): ReturnType<ITokensManager['getTokenByAddress']> {
    const provider = this._getBestProvider({ chainInfo: params.chainInfo })
    return provider.getTokenByAddress(params)
  }

  /** @see ITokensManager.getTokenByName */
  getTokenByName(
    params: Parameters<ITokensManager['getTokenByName']>[0],
  ): ReturnType<ITokensManager['getTokenByName']> {
    const provider = this._getBestProvider({ chainInfo: params.chainInfo })
    return provider.getTokenByName(params)
  }

  /** @see ITokensManager.getTokenBalanceBySymbol */
  async getTokenBalanceBySymbol(
    params: Parameters<ITokensManager['getTokenBalanceBySymbol']>[0],
  ): ReturnType<ITokensManager['getTokenBalanceBySymbol']> {
    const provider = this._getBestProvider({ chainInfo: params.chainInfo })
    return provider.getTokenBalanceBySymbol(params)
  }

  /** @see ITokensManager.getTokenBalanceByAddress */
  async getTokenBalanceByAddress(
    params: Parameters<ITokensManager['getTokenBalanceByAddress']>[0],
  ): ReturnType<ITokensManager['getTokenBalanceByAddress']> {
    const provider = this._getBestProvider({ chainInfo: params.chainInfo })
    return provider.getTokenBalanceByAddress(params)
  }
}
