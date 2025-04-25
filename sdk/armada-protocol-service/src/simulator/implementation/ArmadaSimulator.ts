import {
  IArmadaManager,
  IArmadaParameters,
  IArmadaSimulation,
} from '@summerfi/armada-protocol-common'
import { ArmadaOperationType, ArmadaPositionId, SDKError, SDKErrorType } from '@summerfi/sdk-common'
import { ArmadaSimulatedPosition } from './ArmadaSimulatedPosition'
import { ArmadaSimulation } from './ArmadaSimulation'

/**
 * @class ArmadaSimulator
 * @description Simulator for the Armada protocol
 */
export class ArmadaSimulator {
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
    simulationParams: IArmadaParameters
    armadaManager: IArmadaManager
  }): Promise<IArmadaSimulation> {
    const { simulationParams, armadaManager } = params

    switch (simulationParams.operation) {
      case ArmadaOperationType.Deposit:
        return this._simulateDeposit({ simulationParams, armadaManager })
      case ArmadaOperationType.Withdraw:
        return this.simulateWithdraw({ simulationParams, armadaManager })
      default:
        throw SDKError.createFrom({
          type: SDKErrorType.ArmadaError,
          reason: 'Invalid Armada simulation',
          message: `Operation type not supported for Armada simulation: ${simulationParams.operation}`,
        })
    }
  }

  /** PRIVATE */

  /**
   * @name _simulateDeposit
   * @description Simulates a deposit operation on the Armada protocol
   *
   * @param simulationParams Parameters for the simulation
   * @param armadaManager Armada manager to access the Armada protocol
   *
   * @returns IArmadaSimulation The result of the simulation
   */
  private async _simulateDeposit(params: {
    simulationParams: IArmadaParameters
    armadaManager: IArmadaManager
  }): Promise<IArmadaSimulation> {
    const { simulationParams, armadaManager } = params

    const positionId = ArmadaPositionId.createFrom({
      id: 'Armada',
      user: simulationParams.user,
    })

    const prevPosition = await armadaManager.utils.getPosition({
      positionId,
    })

    const simulatedPosition = ArmadaSimulatedPosition.createFrom({
      armadaManager,
      ...prevPosition,
    })

    await simulatedPosition.deposit(simulationParams.amount)

    return ArmadaSimulation.createFrom({
      user: simulationParams.user,
      previousPosition: prevPosition,
      newPosition: simulatedPosition,
    })
  }

  /**
   * @name simulateWithdraw
   * @description Simulates a withdraw operation on the Armada protocol
   *
   * @param simulationParams Parameters for the simulation
   * @param armadaManager Armada manager to access the Armada protocol
   *
   * @returns IArmadaSimulation The result of the simulation
   */
  private async simulateWithdraw(params: {
    simulationParams: IArmadaParameters
    armadaManager: IArmadaManager
  }): Promise<IArmadaSimulation> {
    const { simulationParams, armadaManager } = params

    const positionId = ArmadaPositionId.createFrom({
      id: 'Armada',
      user: simulationParams.user,
    })

    const prevPosition = await armadaManager.utils.getPosition({
      positionId,
    })

    const simulatedPosition = ArmadaSimulatedPosition.createFrom({
      armadaManager,
      ...prevPosition,
    })

    simulatedPosition.withdraw(simulationParams.amount)

    return ArmadaSimulation.createFrom({
      user: simulationParams.user,
      previousPosition: prevPosition,
      newPosition: simulatedPosition,
    })
  }
}
