import { ChainId, IChainInfo } from '@summerfi/sdk-common'
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
  private _providersByChainId: Map<ChainId, ManagerProvider[]>
  private _providersByType: Map<ProviderType, ManagerProvider>

  /** CONSTRUCTOR */

  protected constructor(params: { providers: ManagerProvider[] }) {
    const { providers } = params

    this._providersByChainId = new Map()
    this._providersByType = new Map()

    for (const provider of providers) {
      this._registerProvider(provider)
    }
  }

  /** PROTECTED */

  /**
   * @method _getBestProvider
   * @description Retrieves the best provider for the given chain
   * @param chainInfo The chain information of the provider to retrieve
   * @param forceUseProvider The provider type to force use
   * @returns The best provider for the given chain
   */
  protected _getBestProvider(params: {
    chainInfo: IChainInfo
    forceUseProvider?: ProviderType
  }): ManagerProvider {
    if (params.forceUseProvider !== undefined) {
      const provider = this._providersByType.get(params.forceUseProvider)
      if (!provider) {
        throw new Error(`Forced provider not found: ${params.forceUseProvider}`)
      }
      return provider
    }
    const providers = this._providersByChainId.get(params.chainInfo.chainId) || []
    if (providers.length === 0) {
      throw new Error(
        `No provider found for chainId: ${params.chainInfo.chainId} ${this._providersByChainId.entries()}`,
      )
    }

    // For now, we just return the first provider. In the future, we can implement a logic to
    // choose the best provider based on the input parameters or on the swap provider's capabilities.
    return providers[0]
  }

  /** PRIVATE */

  /**
   * @method _registerProvider
   * @description Registers a provider to be used by the manager
   * @param provider The provider to register
   */
  private _registerProvider(provider: ManagerProvider): void {
    const forChainIds = provider.getSupportedChainIds()

    for (const chainId of forChainIds) {
      const providers = this._providersByChainId.get(chainId) || []
      providers.push(provider)
      this._providersByChainId.set(chainId, providers)
    }

    this._providersByType.set(provider.type, provider)
  }
}
