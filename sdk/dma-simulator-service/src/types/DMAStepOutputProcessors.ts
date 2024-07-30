import { StepOutputProcessors } from '@summerfi/simulator-common/types'
import { DMASimulatorStepsTypes } from '../enums/DMASimulatorStepsTypes'
import { DMASimulatorSteps } from '../implementation/DMASimulatorSteps'

/**
 * Narrowed down type for the step output processors map in the DMA Simulator
 */
export type DMAStepOutputProcessors = StepOutputProcessors<
  typeof DMASimulatorStepsTypes,
  DMASimulatorSteps
>
