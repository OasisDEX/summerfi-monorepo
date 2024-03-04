import { Simulation, SimulationSteps, SimulationType, steps } from '@summerfi/sdk-common/simulation'
import { OrderPlannerContext } from '~orderplannercommon/context'
import { User, IPositionsManager } from '@summerfi/sdk-common/client'
import { ISwapService } from '@summerfi/swap-common/interfaces'
import { Deployment } from '@summerfi/deployment-utils'

export type FilterStep<T extends SimulationSteps, S extends steps.Steps> = S extends { type: T }
  ? S
  : never

export type ActionBuilderParams<S extends steps.Steps> = {
  context: OrderPlannerContext
  user: User
  positionsManager: IPositionsManager
  simulation: Simulation<SimulationType>
  swapService: ISwapService
  deployment: Deployment
  step: S
}

export type ActionBuilder<S extends steps.Steps> = (params: ActionBuilderParams<S>) => Promise<void>

export type ActionBuildersMap = {
  [T in steps.Steps['type']]: ActionBuilder<FilterStep<T, steps.Steps>>
}
