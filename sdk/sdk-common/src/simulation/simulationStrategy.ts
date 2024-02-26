import { SimulationSteps } from "./enums"

export interface StrategyStep {
    step: SimulationSteps
    optional: boolean
  }
  
export type SimulationStrategy = readonly StrategyStep[]