import { Deployment } from '@summerfi/deployment-utils'
import { Order, type IPositionsManager } from '@summerfi/sdk-common/orders'
import { ISimulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { Maybe } from '@summerfi/sdk-common/common'
import { IUser } from '@summerfi/sdk-common/user'
import { ActionBuildersMap, IProtocolPluginsRegistry } from '@summerfi/protocol-plugins-common'

export type OrderPlannerParams = {
  user: IUser
  positionsManager: IPositionsManager
  simulation: ISimulation<SimulationType>
  actionBuildersMap: ActionBuildersMap
  deployment: Deployment
  swapManager: ISwapManager
  protocolsRegistry: IProtocolPluginsRegistry
}
export interface IOrderPlanner {
  buildOrder(params: OrderPlannerParams): Promise<Maybe<Order>>
}
