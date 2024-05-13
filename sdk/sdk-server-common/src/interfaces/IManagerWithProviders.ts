import { IChainInfo, Maybe } from '@summerfi/sdk-common/common'
import { IManagerProvider } from './IManagerProvider'

/**
 * @name IManagerWithProviders
 * @description This is the highest level interface that will choose and call
 * appropriate provider for a swap
 */
export interface IManagerWithProviders<
  ProviderType extends string,
  ManagerProvider extends IManagerProvider<ProviderType>,
> {
  /**
   * @method registerProvider
   * @description Registers a provider to be used by the manager
   * @param provider The provider to register
   */
  registerProvider(provider: ManagerProvider): void

  /**
   * @method getBestProvider
   * @description Retrieves the best provider for the given chain
   * @param chainInfo The chain information of the provider to retrieve
   * @param forceUseProvider The provider type to force use
   * @returns The best provider for the given chain
   */
  getBestProvider(params: {
    chainInfo: IChainInfo
    forceUseProvider?: ProviderType
  }): Maybe<ManagerProvider>
}
