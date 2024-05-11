import { OrderPlanner } from '@summerfi/order-planner-common/implementation'
import { Order, type IPositionsManager } from '@summerfi/sdk-common/orders'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { IUser } from '@summerfi/sdk-common/user'
import { Maybe } from '@summerfi/sdk-common/common'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { IOrderPlannerService } from '../interfaces/IOrderPlannerService'
import { ActionBuildersConfig } from '../config/Config'
import { IProtocolPluginsRegistry } from '@summerfi/protocol-plugins-common'
import { IAddressBookManager } from '@summerfi/address-book-common'

export class OrderPlannerService implements IOrderPlannerService {
  readonly orderPlanner: OrderPlanner

  constructor() {
    this.orderPlanner = new OrderPlanner()
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
