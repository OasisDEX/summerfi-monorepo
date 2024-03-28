import { SimulationType, ISimulation } from '@summerfi/sdk-common/simulation'
import { Order, IPositionsManager } from '@summerfi/sdk-common/orders'
import { IUser } from '@summerfi/sdk-common/user'

export async function getMockOrder(params: {
  user: IUser
  positionsManager: IPositionsManager
  simulation: ISimulation<SimulationType>
}): Promise<Order> {
  return {
    simulation: params.simulation,
    transactions: [],
  }
}
