import { MigrationSimulationManager } from '~sdk-common/simulations'
import { MigratePositionParameters, MigratePositionSimulation } from '~sdk-common/orders'
import { Position } from '~sdk-common/users'

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
