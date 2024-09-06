import { isArmadaUsersSimulation } from '@summerfi/armada-protocol-common'
import { IOrderPlanner } from '@summerfi/order-planner-common/interfaces'
import { BuildOrderParams } from '@summerfi/order-planner-common/types'
import { Maybe, SDKError, SDKErrorType } from '@summerfi/sdk-common/common'
import { Order } from '@summerfi/sdk-common/orders'
import { SimulationType } from '@summerfi/sdk-common/simulation'

/**
 * @name ArmadaUsersOrderPlanner
 * @description Order planner that generates transactions for the Users of the Armada Protocol based on the input simulation
 *
 * @see IOrderPlanner
 */
export class ArmadaUsersOrderPlanner implements IOrderPlanner {
  /** PUBLIC */

  /** @see IOrderPlanner.buildOrder */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async buildOrder(params: BuildOrderParams): Promise<Maybe<Order>> {
    const { simulation, armadaManager } = params

    if (!isArmadaUsersSimulation(simulation)) {
      throw SDKError.createFrom({
        type: SDKErrorType.OrderPlannerError,
        reason: `Simulation is not an Armada users simulation`,
        message: `Received simulation of type ${simulation.type} instead of Armada`,
      })
    }

    const { previousPosition, newPosition, user } = simulation

    const transactions = previousPosition.amount.isZero()
      ? await armadaManager.getNewDepositTX({
          amount: newPosition.amount,
          poolId: newPosition.pool.id,
          user,
        })
      : await armadaManager.getUpdateDepositTX({
          amount: newPosition.amount,
          poolId: newPosition.pool.id,
          positionId: previousPosition.id,
        })

    return {
      simulation,
      transactions,
    }
  }

  /** @see IOrderPlanner.getAcceptedSimulations */
  getAcceptedSimulations(): SimulationType[] {
    return [SimulationType.ArmadaUsers]
  }
}
