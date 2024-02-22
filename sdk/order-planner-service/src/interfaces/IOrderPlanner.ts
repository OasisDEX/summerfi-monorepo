import { Order, Simulation, SimulationType } from '@summerfi/sdk-common/orders'
import { Maybe } from '@summerfi/sdk-common/utils'

export interface IOrderPlanner {
  buildOrder<T extends SimulationType>(simulation: Simulation<T>): Maybe<Order>
}
