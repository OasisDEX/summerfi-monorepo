import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { ChainId } from '@summerfi/sdk-common'
import { IManagerProvider } from '../interfaces/IManagerProvider'

/**
 * @name ManagerProviderBase
 * @see IManagerProvider
 *
 * Base class for a manager provider. It saves the type of the provider plus the
 * configuration provider to be used to fetch the configuration for the manager provider
 *
 * Typically used when implementing providers for managers like OneInchSwapProvider in the
 * SwapManager
 */
export abstract class ManagerProviderBase<ProviderType extends string>
  implements IManagerProvider<ProviderType>
{
  /** @see IManagerProvider.type */
  readonly type: ProviderType

  /** @see IManagerProvider.configProvider */
  readonly configProvider: IConfigurationProvider

  /** CONSTRUCTOR */
  protected constructor(params: { type: ProviderType; configProvider: IConfigurationProvider }) {
    this.type = params.type
    this.configProvider = params.configProvider
  }

  /** @see IManagerProvider.getSupportedChainIds */
  abstract getSupportedChainIds(): ChainId[]
}
