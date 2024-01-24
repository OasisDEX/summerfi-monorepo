import { Wallet } from '~sdk/common'
import { SimulationManager } from '~sdk/managers'
import { ChainInfo } from '~sdk/chain'
import { Position, PositionId } from '~sdk/user'
import { AutomationSimulationManagerClientImpl } from './simulations/AutomationSimulationManagerClientImpl'
import { FinanceSimulationManagerClientImpl } from './simulations/FinanceSimulationManagerClientImpl'
import { ImportingSimulationManagerClientImpl } from './simulations/ImportingSimulationManagerClientImpl'
import { MigrationSimulationManagerClientImpl } from './simulations/MigrationSimulationManagerClientImpl'
import { RefinanceSimulationManagerClientImpl } from './simulations/RefinanceSimulationManagerClientImpl'

export class SimulationManagerClientImpl implements SimulationManager {
  public readonly finance: FinanceSimulationManagerClientImpl
  public readonly refinance: RefinanceSimulationManagerClientImpl
  public readonly automation: AutomationSimulationManagerClientImpl
  public readonly importing: ImportingSimulationManagerClientImpl
  public readonly migration: MigrationSimulationManagerClientImpl

  public constructor() {
    this.finance = new FinanceSimulationManagerClientImpl()
    this.refinance = new RefinanceSimulationManagerClientImpl()
    this.automation = new AutomationSimulationManagerClientImpl()
    this.importing = new ImportingSimulationManagerClientImpl()
    this.migration = new MigrationSimulationManagerClientImpl()
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
