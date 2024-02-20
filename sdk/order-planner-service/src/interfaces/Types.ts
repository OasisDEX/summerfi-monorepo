import { Simulation, SimulationSteps, SimulationType, Steps } from '@summerfi/sdk-common/orders'
import { ActionCall } from './Action'
import { OrderPlannerContext } from './OrderPlannerContext'

export type Version = number

export type FilterStep<T extends SimulationSteps, S extends Steps> = S extends { type: T }
  ? S
  : never

export type StepBuilder<S extends Steps> = (params: {
  context: OrderPlannerContext
  simulation: Simulation<SimulationType>
  step: S
}) => ActionCall[]

export type StepBuildersMap = { [T in Steps['type']]: StepBuilder<FilterStep<T, Steps>> }

export type Test = FilterStep<SimulationSteps.Flashloan, Steps>
