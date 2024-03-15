import { Order, type IPositionsManager } from '@summerfi/sdk-common/orders'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { IUser } from '@summerfi/sdk-client'
import { Maybe } from '@summerfi/sdk-common/common'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { ProtocolBuilderRegistryType } from '@summerfi/order-planner-common/interfaces'

export interface IOrderPlannerService {
  buildOrder<T extends SimulationType>(params: {
    user: IUser
    positionsManager: IPositionsManager
    simulation: Simulation<T>
    swapManager: ISwapManager
    protocolsRegistry: ProtocolBuilderRegistryType
  }): Promise<Maybe<Order>>
}
