import type { ChainInfo } from '~sdk-common/common/implementation/ChainInfo'
import type { Position } from '~sdk-common/common/implementation/Position'
import type { PositionId } from '~sdk-common/common/implementation/PositionId'
import type { Wallet } from '~sdk-common/common/implementation/Wallet'
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
  public async getPositions(_params: {
    networks: ChainInfo[]
    wallet: Wallet
    ids?: PositionId[]
  }): Promise<Position[]> {
    // TODO: Implement
    return [] as Position[]
  }
}
