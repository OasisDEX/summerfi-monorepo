import { Simulation, SimulationSteps, SimulationType, Steps } from '@summerfi/sdk-common/orders'
import { OrderPlannerContext } from '../context/OrderPlannerContext'
import { PositionsManager, User } from '@summerfi/sdk-common/users'

export type FilterStep<T extends SimulationSteps, S extends Steps> = S extends { type: T }
  ? S
  : never

export type ActionBuilderParams<S extends Steps> = {
  context: OrderPlannerContext
  user: User
  positionsManager: PositionsManager
  simulation: Simulation<SimulationType>
  step: S
}

export type ActionBuilder<S extends Steps> = (params: ActionBuilderParams<S>) => void

export type ActionBuildersMap = { [T in Steps['type']]: ActionBuilder<FilterStep<T, Steps>> }
