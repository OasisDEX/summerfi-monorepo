import { SimulationSteps, steps } from '@summerfi/sdk-common/simulation'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { Deployment } from '@summerfi/deployment-utils'
import { type IPositionsManager } from '@summerfi/sdk-common/orders'
import { type IOrderPlannerContext } from '../interfaces/IOrderPlannerContext'
import { type ProtocolBuilderRegistryType } from '../interfaces/Types'
import { IUser } from '@summerfi/sdk-common/user'

export type FilterStep<T extends SimulationSteps, S extends steps.Steps> = S extends { type: T }
  ? S
  : never

export type ActionBuilderParams<S extends steps.Steps> = {
  context: IOrderPlannerContext
  user: IUser
  positionsManager: IPositionsManager
  swapManager: ISwapManager
  deployment: Deployment
  protocolsRegistry: ProtocolBuilderRegistryType
  step: S
}

export type ActionBuilder<S extends steps.Steps> = (params: ActionBuilderParams<S>) => Promise<void>

export type ActionBuildersMap = {
  [T in steps.Steps['type']]: ActionBuilder<FilterStep<T, steps.Steps>>
}
