import { IOrderPlanner } from '@summerfi/order-planner-common/interfaces'
import { BuildOrderParams } from '@summerfi/order-planner-common/types'
import { Maybe } from '@summerfi/sdk-common/common'
import { Order } from '@summerfi/sdk-common/orders'
import { SimulationType } from '@summerfi/sdk-common/simulation'
/**
 * @name ArmadaOrderPlanner
 * @description Order planner that generates transactions for the Armada Protocol based on the input simulation
 *
 * @see IOrderPlanner
 */
export class ArmadaOrderPlanner implements IOrderPlanner {
  /** PUBLIC */

  /** @see IOrderPlanner.buildOrder */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async buildOrder(params: BuildOrderParams): Promise<Maybe<Order>> {
    // const {
    //   simulation,
    //   contractsProvider,
    //   user,
    //   positionsManager,
    //   addressBookManager,
    //   swapManager,
    //   protocolsRegistry,
    // } = params

    return {} as unknown as Maybe<Order>
  }

  /** @see IOrderPlanner.getAcceptedSimulations */
  getAcceptedSimulations(): SimulationType[] {
    return [SimulationType.Armada]
  }
}
