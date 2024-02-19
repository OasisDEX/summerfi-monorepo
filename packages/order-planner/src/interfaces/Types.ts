import { Simulation, SimulationSteps, SimulationType, Step, Steps } from '@summerfi/sdk/orders'
import { ActionCall } from './Action'

export type Version = number

export type FilterStep<T extends SimulationSteps, S extends Steps> = S extends { type: T }
  ? S
  : never

export type StepBuilder<S extends Step<SimulationSteps, unknown, unknown>> = (params: {
  simulation: Simulation<SimulationType>
  step: S
}) => ActionCall[]

export type StepBuildersMap = { [T in Steps['type']]: StepBuilder<FilterStep<T, Steps>> }

/* This values are coming from TakeFlashloan contract data types */
export enum FlashloanProvider {
  DssFlash = 0,
  Balancer = 1,
}
