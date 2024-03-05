import { Deployment } from '@summerfi/deployment-utils'
import { Order } from '@summerfi/sdk-common/orders'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { IPositionsManager, User } from '@summerfi/sdk-client'
import { Maybe } from '@summerfi/sdk-common/utils'
import { ActionBuildersMap } from '~orderplannercommon/builders'
import { ISwapService } from '@summerfi/swap-common/interfaces'

export interface IOrderPlanner {
  buildOrder<T extends SimulationType>(params: {
    user: User
    positionsManager: IPositionsManager
    simulation: Simulation<T>
    actionBuildersMap: ActionBuildersMap
    deployment: Deployment
    swapService: ISwapService
  }): Promise<Maybe<Order>>
}
