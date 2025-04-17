import {
  BuildOrderParams,
  IOrderPlanner,
  IOrderPlannerService,
  OrderPlannerClass,
} from '@summerfi/order-planner-common'
import { SDKError, SDKErrorType, Maybe, Order, SimulationType } from '@summerfi/sdk-common'
import { assert } from 'console'
import { ActionBuildersConfig } from '../config/Config'
import { DMAOrderPlanner } from './planners/DMAOrderPlanner'

/** @see IOrderPlannerService */
export class OrderPlannerService implements IOrderPlannerService {
  /** Map of order planners per simulation type, used to resolve which planner will generate the order */
  readonly _orderPlanners: Map<SimulationType, IOrderPlanner> = new Map()

  constructor() {
    this._registerOrderPlanner(DMAOrderPlanner)
  }

  async buildOrder(params: Omit<BuildOrderParams, 'actionBuildersMap'>): Promise<Maybe<Order>> {
    const orderPlanner = this._orderPlanners.get(params.simulation.type)
    if (!orderPlanner) {
      throw SDKError.createFrom({
        type: SDKErrorType.OrderPlannerError,
        reason: `Order Planner for simulation not found`,
        message: `No registered Order Planner was found for simulation type ${params.simulation.type}`,
      })
    }

    return orderPlanner.buildOrder({
      user: params.user,
      positionsManager: params.positionsManager,
      simulation: params.simulation,
      armadaManager: params.armadaManager,
      actionBuildersMap: ActionBuildersConfig,
      addressBookManager: params.addressBookManager,
      swapManager: params.swapManager,
      protocolsRegistry: params.protocolsRegistry,
      contractsProvider: params.contractsProvider,
    })
  }

  /** PRIVATE */

  /**
   * Registers an order planner class as the handler for a specific simulation types
   *
   * @param orderPlannerClass Order planner class to register
   */
  private _registerOrderPlanner(orderPlannerClass: OrderPlannerClass): void {
    const orderPlanner = new orderPlannerClass()

    const acceptedSimulations = orderPlanner.getAcceptedSimulations()
    for (const simulationType of acceptedSimulations) {
      assert(
        !this._orderPlanners.has(simulationType),
        `Order planner for simulation type ${simulationType} already registered`,
      )

      this._orderPlanners.set(simulationType, orderPlanner)
    }
  }
}
