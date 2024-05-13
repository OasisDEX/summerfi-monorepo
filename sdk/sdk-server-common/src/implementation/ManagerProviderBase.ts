import { ChainId } from '@summerfi/sdk-common'
import { IManagerProvider } from '../interfaces/IManagerProvider'
import { IConfigurationProvider } from '@summerfi/configuration-provider'

/**
 * @name ManagerProviderBase
 * @see IManagerProvider
 *
 * Base class for a manager provider
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
