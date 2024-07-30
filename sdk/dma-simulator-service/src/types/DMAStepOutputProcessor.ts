import { StepOutputProcessor } from '@summerfi/simulator-common/types'
import { DMASimulatorStepsTypes } from '../enums/DMASimulatorStepsTypes'
import { DMASimulatorSteps } from '../implementation/DMASimulatorSteps'

/**
 * Narrowed down type for a step output processor in the DMA Simulator
 */
export type DMAStepOutputProcessor<SingleStep extends DMASimulatorSteps> = StepOutputProcessor<
  typeof DMASimulatorStepsTypes,
  DMASimulatorSteps,
  SingleStep
>
