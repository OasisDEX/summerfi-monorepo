import { steps } from '@summerfi/sdk-common/simulation'
import { ISimulationState } from '../../../interfaces/DMASimulationState'

export function skippedStepReducer(
  step: steps.SkippedStep,
  state: ISimulationState,
): ISimulationState {
  return {
    ...state,
    steps: [...state.steps, step],
  }
}
