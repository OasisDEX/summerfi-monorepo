import type { SubgraphProviderType } from '@summerfi/sdk-common'
import { IManagerWithProviders } from '@summerfi/sdk-server-common'
import type { ISubgraphProvider } from './ISubgraphProvider'
/**
 * @name ISubgraph
 * @description FILL IN THE DESCRIPTION FOR THE SERVICE HERE interface ISubgraph
 */
export interface ISubgraph extends IManagerWithProviders<SubgraphProviderType, ISubgraphProvider> {
  // TODO: add here the methods that the service will implement
}
