import { isArmadaKeepersSimulation } from '@summerfi/armada-protocol-common'
import { IOrderPlanner } from '@summerfi/order-planner-common/interfaces'
import { BuildOrderParams } from '@summerfi/order-planner-common/types'
import { Maybe, SDKError, SDKErrorType } from '@summerfi/sdk-common/common'
import { Order } from '@summerfi/sdk-common/orders'
import { SimulationType } from '@summerfi/sdk-common/simulation'

/**
 * @name ArmadaKeepersOrderPlanner
 * @description Order planner that generates transactions for the Users of the Armada Protocol based on the input simulation
 *
 * @see IOrderPlanner
 */
export class ArmadaKeepersOrderPlanner implements IOrderPlanner {
  /** PUBLIC */

  /** @see IOrderPlanner.buildOrder */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async buildOrder(params: BuildOrderParams): Promise<Maybe<Order>> {
    const { simulation, armadaManager } = params

    if (!isArmadaKeepersSimulation(simulation)) {
      throw SDKError.createFrom({
        type: SDKErrorType.OrderPlannerError,
        reason: `Simulation is not an Armada keepers simulation`,
        message: `Received simulation of type ${simulation.type} instead of Armada`,
      })
    }

    const { poolId, rebalanceData } = simulation

    const transaction = await armadaManager.rebalance({
      poolId: poolId,
      rebalanceData: rebalanceData,
    })

    return {
      simulation,
      transactions: [transaction],
    }
  }

  /** @see IOrderPlanner.getAcceptedSimulations */
  getAcceptedSimulations(): SimulationType[] {
    return [SimulationType.ArmadaKeepers]
  }
}
