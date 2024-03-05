import { Order } from '@summerfi/sdk-common/orders'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { IPositionsManager, User } from '@summerfi/sdk-client'
import { Maybe } from '@summerfi/sdk-common/utils'
import { ISwapService } from '@summerfi/swap-common/interfaces'

export interface IOrderPlannerService {
  buildOrder<T extends SimulationType>(params: {
    user: User
    positionsManager: IPositionsManager
    simulation: Simulation<T>
    swapService: ISwapService
  }): Promise<Maybe<Order>>
}
