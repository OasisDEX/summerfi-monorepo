import { Simulation, SimulationSteps, SimulationType, Step } from '@summerfi/sdk/orders'
import { ActionCall } from './Action'

export type Version = number

export type StepBuilder<T extends Step<SimulationSteps>> = (params: {
  simulation: Simulation<SimulationType, unknown>
  step: T
}) => ActionCall[]

export type StepBuildersMap = {
  // TODO: remove the question mark when all steps are implemented
  [key in SimulationSteps]?: StepBuilder<Step<key>>
}
