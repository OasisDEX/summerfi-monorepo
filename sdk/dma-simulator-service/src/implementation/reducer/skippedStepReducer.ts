import { DMASimulationState } from '../../interfaces/DMASimulationState'
import { SkippedStep } from '../DMASimulatorSteps'

export function skippedStepReducer(
  step: SkippedStep,
  state: DMASimulationState,
): DMASimulationState {
  return {
    ...state,
    steps: [...state.steps, step],
  }
}
