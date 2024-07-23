import { IAddressBookManager } from '@summerfi/address-book-common'
import { IOrderPlannerService } from '@summerfi/order-planner-common/interfaces'
import { IProtocolPluginsRegistry } from '@summerfi/protocol-plugins-common'
import { Maybe } from '@summerfi/sdk-common/common'
import { Order, type IPositionsManager } from '@summerfi/sdk-common/orders'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { IUser } from '@summerfi/sdk-common/user'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { ActionBuildersConfig } from '../config/Config'
import { DMAOrderPlanner } from './planners'

/** @see IOrderPlannerService */
export class OrderPlannerService implements IOrderPlannerService {
  readonly orderPlanner: DMAOrderPlanner

  constructor() {
    this.orderPlanner = new DMAOrderPlanner()
  }

  async buildOrder(params: {
    user: IUser
    positionsManager: IPositionsManager
    simulation: ISimulation<SimulationType>
    swapManager: ISwapManager
    addressBookManager: IAddressBookManager
    protocolsRegistry: IProtocolPluginsRegistry
  }): Promise<Maybe<Order>> {
    return this.orderPlanner.buildOrder({
      user: params.user,
      positionsManager: params.positionsManager,
      simulation: params.simulation,
      actionBuildersMap: ActionBuildersConfig,
      addressBookManager: params.addressBookManager,
      swapManager: params.swapManager,
      protocolsRegistry: params.protocolsRegistry,
    })
  }
}
