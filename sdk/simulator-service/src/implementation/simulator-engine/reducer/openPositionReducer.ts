import { steps } from '@summerfi/sdk-common/simulation'
import { ISimulationState } from '../../../interfaces/simulation'

export function openPositionReducer(step: steps.OpenPosition, state: ISimulationState): ISimulationState {
  return {
    ...state,
    steps: {
      ...state.steps,
      [step.name]: step,
    },
  }
}
