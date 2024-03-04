import { IUser } from '~sdk-common/client/interfaces/IUser'
import { IPositionsManager } from '~sdk-common/client/interfaces/IPositionsManager'
import type { Order } from '~sdk-common/orders/interfaces/common/Order'
import type { Simulation } from '~sdk-common/simulation/simulation'
import type { SimulationType } from '~sdk-common/simulation/enums'

export async function getMockOrder(params: {
  user: IUser
  positionsManager: IPositionsManager
  simulation: Simulation<SimulationType>
}): Promise<Order> {
  return {
    simulation: params.simulation,
    transactions: [],
  }
}
