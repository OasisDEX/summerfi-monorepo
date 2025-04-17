import { steps } from '@summerfi/sdk-common'
import { ISimulationState } from '../../../interfaces/simulation'

export function skippedStepReducer(
  step: steps.SkippedStep,
  state: ISimulationState,
): ISimulationState {
  return {
    ...state,
    steps: [...state.steps, step],
  }
}
