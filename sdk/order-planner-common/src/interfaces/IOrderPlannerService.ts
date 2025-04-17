import { Maybe, Order } from '@summerfi/sdk-common'
import { BuildOrderParams } from '../types/BuildOrderParams'

/**
 * Order planner service interface
 *
 * The order planner service is responsible for building orders based on a simulation result. The generated
 * order can be used to execute the actions required to perform the simulation.
 *
 * The order planner service has several order planners registered per simulation type. When the request to build
 * an order is received, the service will delegate the order building to the correct order planner based on the
 * simulation type.
 */
export interface IOrderPlannerService {
  /** @see IOrderPlanner.buildOrder */
  buildOrder(params: Omit<BuildOrderParams, 'actionBuildersMap'>): Promise<Maybe<Order>>
}
