import { Order, Simulation, SimulationType } from '~sdk-common/orders'
import { type User } from '~sdk-common/client/implementation'
import { IPositionsManager } from '~sdk-common/client/interfaces'

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
