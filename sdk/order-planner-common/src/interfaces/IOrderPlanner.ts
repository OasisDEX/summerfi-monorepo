import { Deployment } from '@summerfi/deployment-utils'
import { Order, type IPositionsManager } from '@summerfi/sdk-common/orders'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { IUser } from '@summerfi/sdk-client'
import { ActionBuildersMap } from '../builders/Types'
import { Maybe } from '@summerfi/sdk-common/common'
import { ProtocolBuilderRegistryType } from './Types'

export interface IOrderPlanner {
  buildOrder<T extends SimulationType>(params: {
    user: IUser
    positionsManager: IPositionsManager
    simulation: Simulation<T>
    actionBuildersMap: ActionBuildersMap
    deployment: Deployment
    swapManager: ISwapManager
    protocolsRegistry: ProtocolBuilderRegistryType
  }): Promise<Maybe<Order>>
}
