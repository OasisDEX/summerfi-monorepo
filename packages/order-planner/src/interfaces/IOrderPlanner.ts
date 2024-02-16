import { Order, Simulation, SimulationType } from '@summerfi/sdk/orders'
import { Maybe } from '@summerfi/sdk/utils'

export interface IOrderPlanner {
  buildOrder<T extends SimulationType>(simulation: Simulation<T>): Maybe<Order<T>>
}
