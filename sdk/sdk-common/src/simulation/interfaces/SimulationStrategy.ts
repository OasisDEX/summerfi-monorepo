import { SimulationSteps } from '../enums/SimulationSteps'

export interface StrategyStep {
  name: string
  step: SimulationSteps
  optional: boolean
}

export type SimulationStrategy = readonly StrategyStep[]
