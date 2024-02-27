import { MigrationSimulationManager } from '~sdk-common/simulations'
import { MigratePositionParameters, MigratePositionSimulation } from '~sdk-common/orders'
import type { Position } from '~sdk-common/common/implementation'

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
