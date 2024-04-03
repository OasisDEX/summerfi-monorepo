import { steps } from '@summerfi/sdk-common/simulation'
import { SimulationState } from '../../../interfaces/simulation'

export function newPositionEventReducer(
  step: steps.NewPositionEvent,
  state: SimulationState,
): SimulationState {
  return {
    ...state,
    steps: {
      ...state.steps,
      [step.name]: step,
    },
  }
}
