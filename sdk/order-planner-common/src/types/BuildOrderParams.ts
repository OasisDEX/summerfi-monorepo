import { IAddressBookManager } from '@summerfi/address-book-common'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import { ActionBuildersMap, IProtocolPluginsRegistry } from '@summerfi/protocol-plugins-common'
import { type IPositionsManager } from '@summerfi/sdk-common/orders'
import { ISimulation } from '@summerfi/sdk-common/simulation'
import { IUser } from '@summerfi/sdk-common/user'
import { ISwapManager } from '@summerfi/swap-common/interfaces'

/**
 * Type for the parameters to build an order, shared among all order planners
 */
export type BuildOrderParams = {
  /** User that is requesting the order */
  user: IUser
  /** DPM associated to this order and the one that will execute it, optional */
  positionsManager?: IPositionsManager
  /** Simulation to generate the order */
  simulation: ISimulation

  /** DEPENDENCIES */
  actionBuildersMap: ActionBuildersMap
  swapManager: ISwapManager
  addressBookManager: IAddressBookManager
  protocolsRegistry: IProtocolPluginsRegistry
  contractsProvider: IContractsProvider
}
