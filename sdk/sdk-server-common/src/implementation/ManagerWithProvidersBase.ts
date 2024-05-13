import { ChainId, IChainInfo, Maybe } from '@summerfi/sdk-common/common'
import { IManagerProvider } from '../interfaces/IManagerProvider'
import { IManagerWithProviders } from '../interfaces/IManagerWithProviders'

/**
 * @name ManagerWithProvidersBase
 * @description Base class for a manager with providers. It takes care of registering the different providers
 *              and provides a basic implementation to get the best provider
 */
export class ManagerWithProvidersBase<
  ProviderType extends string,
  ManagerProvider extends IManagerProvider<ProviderType>,
> implements IManagerWithProviders<ProviderType, ManagerProvider>
{
  private _providersByChainId: Map<ChainId, IManagerProvider<ProviderType>[]>
  private _providersByType: Map<ProviderType, IManagerProvider<ProviderType>>

  /** CONSTRUCTOR */

  protected constructor(params: { providers: IManagerProvider<ProviderType>[] }) {
    const { providers } = params

    this._providersByChainId = new Map()
    this._providersByType = new Map()

    for (const provider of providers) {
      this.registerProvider(provider)
    }
  }

  /** @see IManagerWithProviders.registerProvider */
  registerProvider(provider: IManagerProvider<ProviderType>): void {
    const forChainIds = provider.getSupportedChainIds()

    for (const chainId of forChainIds) {
      const providers = this._providersByChainId.get(chainId) || []
      providers.push(provider)
      this._providersByChainId.set(chainId, providers)
    }

    this._providersByType.set(provider.type, provider)
  }

  /** @see IManagerWithProviders.getBestProvider */
  getBestProvider(params: {
    chainInfo: IChainInfo
    forceUseProvider?: ProviderType
  }): Maybe<ManagerProvider> {
    if (params.forceUseProvider) {
      const provider = this._providersByType.get(params.forceUseProvider)
      if (provider) {
        return provider as ManagerProvider
      }
    }

    const providers = this._providersByChainId.get(params.chainInfo.chainId) || []
    if (providers.length === 0) {
      return undefined
    }

    // For now, we just return the first provider. In the future, we can implement a logic to
    // choose the best provider based on the input parameters or on the swap provider's capabilities.
    return providers[0] as ManagerProvider
  }
}
