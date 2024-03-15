import type { IUser } from '~sdk-client/interfaces/IUser'
import { SimulationType, Simulation } from '@summerfi/sdk-common/simulation'
import { Order, IPositionsManager } from '@summerfi/sdk-common/orders'

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
