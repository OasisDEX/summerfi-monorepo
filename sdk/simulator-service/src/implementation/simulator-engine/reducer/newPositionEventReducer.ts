import { steps } from '@summerfi/sdk-common/simulation'
import { ISimulationState } from '../../../interfaces/simulation'

export function newPositionEventReducer(
  step: steps.NewPositionEventStep,
  state: ISimulationState,
): ISimulationState {
  return {
    ...state,
    steps: [
      ...state.steps,
      step,
    ],
  }
}
