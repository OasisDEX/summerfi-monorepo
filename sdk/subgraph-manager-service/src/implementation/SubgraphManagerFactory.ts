import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { ArmadaSubgraphManager } from './armada/ArmadaSubgraphManager'
import { DcaSubgraphManager } from './dca/DcaSubgraphManager'
import { RwaSubgraphManager } from './rwa/RwaSubgraphManager'
import type { InstiVersion } from '@summerfi/sdk-common'

/**
 * @name SubgraphManagerFactory
 * @description This class is responsible for creating instances of the SubgraphManager
 */
export class SubgraphManagerFactory {
  public static newArmadaSubgraph(params: {
    configProvider: IConfigurationProvider
    clientId?: string
    instiVersion?: InstiVersion
  }): ArmadaSubgraphManager {
    return new ArmadaSubgraphManager(params)
  }

  public static newDcaSubgraph(params: {
    configProvider: IConfigurationProvider
  }): DcaSubgraphManager {
    return new DcaSubgraphManager(params)
  }

  public static newRwaSubgraph(params: {
    configProvider: IConfigurationProvider
    clientId?: string
    instiVersion?: InstiVersion
  }): RwaSubgraphManager {
    return new RwaSubgraphManager(params)
  }
}
