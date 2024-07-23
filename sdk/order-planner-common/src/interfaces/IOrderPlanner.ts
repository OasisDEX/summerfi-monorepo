import { IAddressBookManager } from '@summerfi/address-book-common'
import { ActionBuildersMap, IProtocolPluginsRegistry } from '@summerfi/protocol-plugins-common'
import { Maybe } from '@summerfi/sdk-common/common'
import { Order, type IPositionsManager } from '@summerfi/sdk-common/orders'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { IUser } from '@summerfi/sdk-common/user'
import { ISwapManager } from '@summerfi/swap-common/interfaces'

/**
 * Type for the parameters to build an order
 */
export type OrderPlannerParams = {
  /** User that is requesting the order */
  user: IUser
  /** DPM associated to this order and the one that will execute it */
  positionsManager: IPositionsManager
  /** Simulation to generate the order */
  simulation: ISimulation<SimulationType>
  /** List of action builders to use for translating simulation steps into calldata */
  actionBuildersMap: ActionBuildersMap
  /** Address book to look up contracts addresses */
  addressBookManager: IAddressBookManager
  /** Component to request swap quotes and fetch swap calldata for use in the Swap action */
  swapManager: ISwapManager
  /** Registry of available protocol plugins */
  protocolsRegistry: IProtocolPluginsRegistry
}

/**
 * @name IOrderPlanner
 * @description Component that transforms a simulation into an Order, including the necessary transactions to
 *              execute them
 */
export interface IOrderPlanner {
  /**
   * Builds an order from a simulation
   * @see OrderPlannerParams
   */
  buildOrder(params: OrderPlannerParams): Promise<Maybe<Order>>

  /**
   * Get the list of accepted simulations for the order planner
   */
  getAcceptedSimulations(): Promise<SimulationType[]>
}
