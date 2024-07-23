import { IAddressBookManager } from '@summerfi/address-book-common'
import { IProtocolPluginsRegistry } from '@summerfi/protocol-plugins-common'
import { Maybe } from '@summerfi/sdk-common/common'
import { Order, type IPositionsManager } from '@summerfi/sdk-common/orders'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { IUser } from '@summerfi/sdk-common/user'
import { ISwapManager } from '@summerfi/swap-common/interfaces'

/**
 * Order planner service interface
 *
 * The order planner service is responsible for building orders based on a simulation result. The generated
 * order can be used to execute the actions required to perform the simulation.
 */
export interface IOrderPlannerService {
  buildOrder<T extends SimulationType>(params: {
    user: IUser
    positionsManager: IPositionsManager
    simulation: ISimulation<T>
    swapManager: ISwapManager
    addressBookManager: IAddressBookManager
    protocolsRegistry: IProtocolPluginsRegistry
  }): Promise<Maybe<Order>>
}
