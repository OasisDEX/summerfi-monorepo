import type { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import {
  IArmadaSubgraphManager,
  type IArmadaSubgraphProvider,
} from '@summerfi/subgraph-manager-common'
import { ArmadaSubgraphProvider } from './ArmadaSubgraphProvider'

/**
 * @name ArmadaSubgraphManager
 * @implements IArmadaSubgraphManager
 */
export class ArmadaSubgraphManager implements IArmadaSubgraphManager {
  private _configProvider: IConfigurationProvider
  private _provider: IArmadaSubgraphProvider

  /** CONSTRUCTOR */
  constructor(params: { configProvider: IConfigurationProvider }) {
    this._configProvider = params.configProvider
    this._provider = new ArmadaSubgraphProvider({
      configProvider: this._configProvider,
    })
  }

  getUserPositions(params: Parameters<IArmadaSubgraphManager['getUserPositions']>[0]) {
    const rawUserPositions = this._provider.getUserPositions(params)

    return rawUserPositions
  }
}
