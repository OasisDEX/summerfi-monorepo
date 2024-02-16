import { Order, Simulation, SimulationType } from '@summerfi/sdk/orders'
import { Maybe } from '@summerfi/sdk/utils'
import { IOrderPlanner } from '~orderplanner/interfaces/IOrderPlanner'

export class OrderPlanner implements IOrderPlanner {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  buildOrder<T extends SimulationType>(simulation: Simulation<T>): Maybe<Order<T>> {
    throw new Error('Method not implemented.')
  }
}
