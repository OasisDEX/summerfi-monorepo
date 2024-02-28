import {
  Wallet,
  type ChainInfo,
  type PositionId,
  type Position,
} from '~sdk-common/common/implementation'

import { RefinanceSimulationManager } from './RefinanceSimulationManager'

export class SimulationManager {
  public readonly finance: undefined
  public readonly refinance: RefinanceSimulationManager
  public readonly automation: undefined
  public readonly importing: undefined
  public readonly migration: undefined

  public constructor() {
    this.refinance = new RefinanceSimulationManager()
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getPositions(params: {
    networks: ChainInfo[]
    wallet: Wallet
    ids?: PositionId[]
  }): Promise<Position[]> {
    // TODO: Implement
    return [] as Position[]
  }
}
