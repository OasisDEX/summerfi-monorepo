import { MigrationSimulationManager } from '~sdk/managers'
import { MigratePositionParameters, MigratePositionSimulation } from '~sdk/orders'
import { Position } from '~sdk/user'

export class MigrationSimulationManagerClientImpl implements MigrationSimulationManager {
  public async simulateMigratePosition(params: {
    position: Position
    parameters?: MigratePositionParameters
  }): Promise<MigratePositionSimulation> {
    // TODO: Implement
    return {} as MigratePositionSimulation
  }
}
