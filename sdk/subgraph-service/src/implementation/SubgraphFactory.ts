import { IConfigurationProvider } from '@summerfi/configuration-provider'
import { Subgraph } from './Subgraph'

/**
 * @name SubgraphFactory
 * @description This class is responsible for creating instances of the Subgraph
 */
export class SubgraphFactory {
  public static newSubgraph(params: { configProvider: IConfigurationProvider }): Subgraph {
    return new Subgraph(params)
  }
}
