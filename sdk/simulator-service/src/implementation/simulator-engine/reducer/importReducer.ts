import { steps } from '@summerfi/sdk-common'
import { ISimulationState } from '../../../interfaces/simulation'

export function importReducer(step: steps.ImportStep, state: ISimulationState): ISimulationState {
  return {
    ...state,
    steps: [...state.steps, step],
  }
}
