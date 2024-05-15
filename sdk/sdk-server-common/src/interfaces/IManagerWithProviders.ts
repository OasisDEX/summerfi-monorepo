import { IManagerProvider } from './IManagerProvider'

/**
 * @name IManagerWithProviders
 * @description This is the highest level interface that will choose and call
 * appropriate provider for a swap
 *
 * The manager interface is quite empty because the methods that are useful are in the
 * base implementation ManagerWithProvidersBase
 */
export interface IManagerWithProviders<
  ProviderType extends string,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  ManagerProvider extends IManagerProvider<ProviderType>,
> {
  // Empty on purpose
}
