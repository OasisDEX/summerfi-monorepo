import { Deployment } from '@summerfi/deployment-utils'
import { Order, type IPositionsManager } from '@summerfi/sdk-common/orders'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { User } from '@summerfi/sdk-client'
import { ActionBuildersMap } from '../builders/Types'
import { Maybe } from '@summerfi/sdk-common/common'

export interface IOrderPlanner {
  buildOrder<T extends SimulationType>(params: {
    user: User
    positionsManager: IPositionsManager
    simulation: Simulation<T>
    actionBuildersMap: ActionBuildersMap
    deployment: Deployment
    swapManager: ISwapManager
  }): Promise<Maybe<Order>>
}
