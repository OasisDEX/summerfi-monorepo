import { steps } from '@summerfi/sdk-common'
import { StepOutputProcessors } from '@summerfi/simulator-common/types'
import { DMASimulatorStepsTypes } from '../enums/DMASimulatorStepsTypes'

export type DMAStepOutputProcessorsType = StepOutputProcessors<
  typeof DMASimulatorStepsTypes,
  steps.Steps
>
