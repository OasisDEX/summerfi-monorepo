import { Order, Simulation, SimulationType } from '@summerfi/sdk-common/orders'
import { PositionsManager, User } from '@summerfi/sdk-common/users'
import { Maybe } from '@summerfi/sdk-common/utils'

export interface IOrderPlannerService {
  buildOrder<T extends SimulationType>(params: {
    user: User
    positionsManager: PositionsManager
    simulation: Simulation<T>
  }): Maybe<Order>
}
