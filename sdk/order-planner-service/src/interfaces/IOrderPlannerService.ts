import { Order, type IPositionsManager } from '@summerfi/sdk-common/orders'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { IUser } from '@summerfi/sdk-common/user'
import { Maybe } from '@summerfi/sdk-common/common'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { IProtocolPluginsRegistry } from '@summerfi/protocol-plugins-common'

export interface IOrderPlannerService {
  buildOrder<T extends SimulationType>(params: {
    user: IUser
    positionsManager: IPositionsManager
    simulation: ISimulation<T>
    swapManager: ISwapManager
    protocolsRegistry: IProtocolPluginsRegistry
  }): Promise<Maybe<Order>>
}
