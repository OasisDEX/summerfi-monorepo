import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { ISubgraph } from '@summerfi/subgraph-common'

/**
 * @name Subgraph
 * @implements ISubgraph
 */
export class Subgraph implements ISubgraph {
  private _configProvider: IConfigurationProvider

  /** CONSTRUCTOR */
  constructor(params: { configProvider: IConfigurationProvider }) {
    this._configProvider = params.configProvider
  }

  // TODO: add here the methods that the service will implement
}
