import {
  IArmadaKeepersParameters,
  IArmadaKeepersSimulation,
  IArmadaManager,
} from '@summerfi/armada-protocol-common'
import { ArmadaKeepersSimulation } from './ArmadaKeepersSimulation'

/**
 * @class ArmadaKeepersSimulator
 * @description Simulator for the Armada protocol Keepers operations
 */
export class ArmadaKeepersSimulator {
  constructor() {
    // Empty constructor
  }

  /**
   * @name simulate
   * @description Simulates an operation on the Armada protocol
   *
   * @param simulationParams Parameters for the simulation
   * @param armadaManager Armada manager to access the Armada protocol
   *
   * @returns IArmadaSimulation The result of the simulation
   */
  async simulate(params: {
    simulationParams: IArmadaKeepersParameters
    armadaManager: IArmadaManager
  }): Promise<IArmadaKeepersSimulation> {
    const { simulationParams, armadaManager } = params

    return this._simulateRebalance({ simulationParams, armadaManager })
  }

  /** PRIVATE */

  /**
   * @name _simulateRebalance
   * @description Simulates a rebalance operation on the Armada protocol
   *
   * @param simulationParams Parameters for the simulation
   * @param armadaManager Armada manager to access the Armada protocol
   *
   * @returns IArmadaKeepersSimulation The result of the simulation
   */
  private async _simulateRebalance(params: {
    simulationParams: IArmadaKeepersParameters
    armadaManager: IArmadaManager
  }): Promise<IArmadaKeepersSimulation> {
    const { simulationParams } = params

    const { keeper, poolId, rebalanceData } = simulationParams

    // TODO: Placeholder implementation of the simulation until we figure out what has to be done here
    return ArmadaKeepersSimulation.createFrom({
      keeper: keeper,
      poolId: poolId,
      rebalanceData: rebalanceData,
    })
  }
}
