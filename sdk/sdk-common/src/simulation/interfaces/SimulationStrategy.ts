import { SimulationSteps } from '../enums/SimulationSteps'

/** A single named step within a simulation strategy, and whether it is optional. */
export interface StrategyStep {
  name: string
  step: SimulationSteps
  optional: boolean
}

/** An ordered, read-only sequence of {@link StrategyStep}s defining a simulation strategy. */
export type SimulationStrategy = readonly StrategyStep[]
