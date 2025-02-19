import type { IAddress, IChainInfo, IToken } from '@summerfi/sdk-common/common'
import { TokensProviderType } from '@summerfi/sdk-common/tokens'
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
  async getTokenBySymbol(params: { chainInfo: IChainInfo; symbol: string }): Promise<IToken> {
    const provider = this._getBestProvider({ chainInfo: params.chainInfo })
    return provider.getTokenBySymbol(params)
  }

  /** @see ITokensManager.getTokenByAddress */
  async getTokenByAddress(params: { chainInfo: IChainInfo; address: IAddress }): Promise<IToken> {
    const provider = this._getBestProvider({ chainInfo: params.chainInfo })
    return provider.getTokenByAddress(params)
  }

  /** @see ITokensManager.getTokenByName */
  async getTokenByName(params: { chainInfo: IChainInfo; name: string }): Promise<IToken> {
    const provider = this._getBestProvider({ chainInfo: params.chainInfo })
    return provider.getTokenByName(params)
  }
}
