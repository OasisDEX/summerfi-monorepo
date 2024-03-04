import { User } from '~sdk-common/client/implementation/User'
import { IPositionsManager } from '~sdk-common/client/interfaces/IPositionsManager'
import type { Order } from '~sdk-common/orders'
import type { Simulation, SimulationType } from '~sdk-common/simulation'

export async function getMockOrder(params: {
  user: User
  positionsManager: IPositionsManager
  simulation: Simulation<SimulationType>
}): Promise<Order> {
  return {
    simulation: params.simulation,
    transactions: [],
  }
}
