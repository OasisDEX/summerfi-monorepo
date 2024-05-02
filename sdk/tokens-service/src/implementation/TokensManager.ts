import type { Maybe } from '@summerfi/sdk-common/common/aliases'
import type { IAddress, IChainInfo, IToken } from '@summerfi/sdk-common/common'
import { ChainId } from '@summerfi/sdk-common/common'
import { TokensProviderType } from '@summerfi/sdk-common/tokens'
import { ITokensManager, ITokensProvider } from '@summerfi/tokens-common'

/**
 * @name TokensManagerProviderConfig
 * @description Configuration for the TokensManager. It includes the list of available providers
 */
export type TokensManagerProviderConfig = {
  provider: ITokensProvider
}

/**
 * @name TokensManager
 * @description Implementation of the ITokensManager interface. It allows to retrieve information for a Token
 */
export class TokensManager implements ITokensManager {
  private _providersByChainId: Map<ChainId, ITokensProvider[]>
  private _providersByType: Map<TokensProviderType, ITokensProvider>

  /** CONSTRUCTOR */
  constructor(params: { providersConfig: TokensManagerProviderConfig[] }) {
    const { providersConfig } = params

    this._providersByChainId = new Map()
    this._providersByType = new Map()

    for (const config of providersConfig) {
      this._registerProvider(config.provider)
    }
  }

  /** PUBLIC METHODS */

  /** @see ITokensManager.getTokenBySymbol */
  async getTokenBySymbol(params: {
    chainInfo: IChainInfo
    symbol: string
  }): Promise<Maybe<IToken>> {
    const provider = this._getBestProvider({ chainInfo: params.chainInfo })
    if (!provider) {
      return undefined
    }

    return provider.getTokenBySymbol(params)
  }

  /** @see ITokensManager.getTokenByAddress */
  async getTokenByAddress(params: {
    chainInfo: IChainInfo
    address: IAddress
  }): Promise<Maybe<IToken>> {
    const provider = this._getBestProvider({ chainInfo: params.chainInfo })
    if (!provider) {
      return undefined
    }

    return provider.getTokenByAddress(params)
  }

  /** @see ITokensManager.getTokenByName */
  async getTokenByName(params: { chainInfo: IChainInfo; name: string }): Promise<Maybe<IToken>> {
    const provider = this._getBestProvider({ chainInfo: params.chainInfo })
    if (!provider) {
      return undefined
    }

    return provider.getTokenByName(params)
  }

  /** PRIVATE METHODS */
  private _registerProvider(provider: ITokensProvider): void {
    const forChainIds = provider.getSupportedChainIds()

    for (const chainId of forChainIds) {
      const providers = this._providersByChainId.get(chainId) || []
      providers.push(provider)
      this._providersByChainId.set(chainId, providers)
    }

    this._providersByType.set(provider.type, provider)
  }

  private _getBestProvider(params: {
    chainInfo: IChainInfo
    forceUseProvider?: TokensProviderType
  }): Maybe<ITokensProvider> {
    if (params.forceUseProvider) {
      const provider = this._providersByType.get(params.forceUseProvider)
      if (provider) {
        return provider
      }
    }

    const providers = this._providersByChainId.get(params.chainInfo.chainId) || []
    if (providers.length === 0) {
      return undefined
    }

    // For now, we just return the first provider. In the future, we can implement a logic to
    // choose the best provider based on the input parameters or on the swap provider's capabilities.
    return providers[0]
  }
}
