import { Simulation, SimulationSteps, SimulationType, Steps } from '@summerfi/sdk-common/orders'
import { OrderPlannerContext } from '~orderplannercommon/context'
import { User, IPositionsManager } from '@summerfi/sdk-common/client'

export type FilterStep<T extends SimulationSteps, S extends Steps> = S extends { type: T }
  ? S
  : never

export type ActionBuilderParams<S extends Steps> = {
  context: OrderPlannerContext
  user: User
  positionsManager: IPositionsManager
  simulation: Simulation<SimulationType>
  step: S
}

export type ActionBuilder<S extends Steps> = (params: ActionBuilderParams<S>) => void

export type ActionBuildersMap = { [T in Steps['type']]: ActionBuilder<FilterStep<T, Steps>> }
