import {
  ISubgraph,
} from '@summerfi/subgraph-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider'

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
