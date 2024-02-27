import { Order, Simulation, SimulationType } from '@summerfi/sdk-common/orders'
import { IPositionsManager, User } from '@summerfi/sdk-common/client'
import { Maybe } from '@summerfi/sdk-common/utils'

export interface IOrderPlannerService {
  buildOrder<T extends SimulationType>(params: {
    user: User
    positionsManager: IPositionsManager
    simulation: Simulation<T>
  }): Maybe<Order>
}
