import { Deployment } from '@summerfi/deployment-utils'
import { Order, Simulation, SimulationType } from '@summerfi/sdk-common/orders'
import { IPositionsManager, User } from '@summerfi/sdk-common/client'
import { Maybe } from '@summerfi/sdk-common/utils'
import { ActionBuildersMap } from '~orderplannercommon/builders'

export interface IOrderPlanner {
  buildOrder<T extends SimulationType>(params: {
    user: User
    positionsManager: IPositionsManager
    simulation: Simulation<T>
    actionBuildersMap: ActionBuildersMap
    deployment: Deployment
  }): Maybe<Order>
}
