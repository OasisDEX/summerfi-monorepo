import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { ChainId } from '@summerfi/sdk-common'

/**
 * @name IManagerProvider
 * @description A provider for a generic manager
 */
export interface IManagerProvider<ProviderType extends string> {
  /**
   * @name type
   * @description The type of the provider, to identify it
   */
  readonly type: ProviderType

  /**
   * @name configProvider
   * @description The configuration provider used by the manager
   */
  readonly configProvider: IConfigurationProvider

  /**
   * @method getSupportedChainIds
   * @description Retrieves the list of supported chain IDs for this provider
   * @returns The list of supported chain IDs
   *
   * Used to filter out the providers that do not support the chain ID
   */
  getSupportedChainIds(): ChainId[]
}
