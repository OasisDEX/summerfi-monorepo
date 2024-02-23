import { Wallet } from '~sdk-common/common'
import { SimulationsManager } from '~sdk-common/simulations'
import { ChainInfo } from '~sdk-common/chains'
import { Position, PositionId } from '~sdk-common/users'
import { AutomationSimulationManagerClientImpl } from './AutomationSimulationManagerClientImpl'
import { FinanceSimulationManagerClientImpl } from './FinanceSimulationManagerClientImpl'
import { ImportingSimulationManagerClientImpl } from './ImportingSimulationManagerClientImpl'
import { MigrationSimulationManagerClientImpl } from './MigrationSimulationManagerClientImpl'
import { RefinanceSimulationManagerClientImpl } from './RefinanceSimulationManagerClientImpl'

export class SimulationManagerClientImpl implements SimulationsManager {
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
