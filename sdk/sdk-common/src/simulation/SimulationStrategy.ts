import type { SimulationSteps } from './Enums'

export interface StrategyStep {
  step: SimulationSteps
  optional: boolean
}

export type SimulationStrategy = readonly StrategyStep[]
