import { SimulationStrategy, SimulatorConfig, StepsAdded } from '@summerfi/simulator-common/types'
import { DMASimulatorStepsTypes } from '../enums/DMASimulatorStepsTypes'
import { DMASimulatorSteps } from '../implementation/DMASimulatorSteps'
import { DMASimulationState } from './DMASimulationState'

/**
 * Configuration for the DMA Simulator
 *
 * Empty as all of the fields are defined in SimulatorConfig, but it narrows down the type
 * to the specific enum for the DMA steps
 */
export interface DMASimulatorConfig
  extends SimulatorConfig<
    typeof DMASimulatorStepsTypes,
    SimulationStrategy<typeof DMASimulatorStepsTypes>,
    DMASimulatorSteps,
    StepsAdded<typeof DMASimulatorStepsTypes, DMASimulatorSteps>,
    DMASimulationState
  > {
  // Empty as all of the fields are defined in SimulatorConfig, but it narrows down the type
}
