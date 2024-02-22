import { Simulation, SimulationSteps, SimulationType, Steps } from '@summerfi/sdk-common/orders'
import { OrderPlannerContext } from '../context/OrderPlannerContext'

export type FilterStep<T extends SimulationSteps, S extends Steps> = S extends { type: T }
  ? S
  : never

export type ActionBuilder<S extends Steps> = (params: {
  context: OrderPlannerContext
  simulation: Simulation<SimulationType>
  step: S
}) => void

export type ActionBuildersMap = { [T in Steps['type']]: ActionBuilder<FilterStep<T, Steps>> }
