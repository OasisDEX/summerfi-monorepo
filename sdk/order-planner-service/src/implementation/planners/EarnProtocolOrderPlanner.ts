import { IOrderPlanner, OrderPlannerParams } from '@summerfi/order-planner-common/interfaces'
import { Maybe } from '@summerfi/sdk-common/common'
import { Order } from '@summerfi/sdk-common/orders'
import { SimulationType } from '@summerfi/sdk-common/simulation'

/**
 * @name EarnProtocolOrderPlanner
 * @description Order planner that generates transactions for the Earn Protocol based on the input simulation
 *
 * @see IOrderPlanner
 */
export class EarnProtocolOrderPlanner implements IOrderPlanner {
  /** PUBLIC */

  /** @see IOrderPlanner.buildOrder */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async buildOrder(params: OrderPlannerParams): Promise<Maybe<Order>> {
    return undefined
  }

  /** @see IOrderPlanner.getAcceptedSimulations */
  async getAcceptedSimulations(): Promise<SimulationType[]> {
    return [SimulationType.EarnProtocol]
  }
}
