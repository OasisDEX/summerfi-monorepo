import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { ArmadaSubgraphManager } from './armada/ArmadaSubgraphManager'

/**
 * @name SubgraphManagerFactory
 * @description This class is responsible for creating instances of the SubgraphManager
 */
export class SubgraphManagerFactory {
  public static newArmadaSubgraph(params: {
    configProvider: IConfigurationProvider
    clientId?: string
  }): ArmadaSubgraphManager {
    return new ArmadaSubgraphManager(params)
  }
}
