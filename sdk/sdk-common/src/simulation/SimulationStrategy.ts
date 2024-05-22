import type { SimulationSteps } from './Enums'

export interface StrategyStep {
  name: string
  step: SimulationSteps
  optional: boolean
}

export type SimulationStrategy = readonly StrategyStep[]
