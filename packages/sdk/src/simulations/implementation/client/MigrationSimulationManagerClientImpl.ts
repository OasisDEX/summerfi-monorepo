import { MigrationSimulationManager } from '~sdk/simulations'
import { MigratePositionParameters, MigratePositionSimulation } from '~sdk/orders'
import { Position } from '~sdk/users'

export class MigrationSimulationManagerClientImpl implements MigrationSimulationManager {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async simulateMigratePosition(params: {
    position: Position
    parameters?: MigratePositionParameters
  }): Promise<MigratePositionSimulation> {
    // TODO: Implement
    return {} as MigratePositionSimulation
  }
}
