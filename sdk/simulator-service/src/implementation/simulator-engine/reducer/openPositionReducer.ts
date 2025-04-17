import { steps } from '@summerfi/sdk-common'
import { ISimulationState } from '../../../interfaces/simulation'

export function openPositionReducer(
  step: steps.OpenPosition,
  state: ISimulationState,
): ISimulationState {
  return {
    ...state,
    positions: {
      ...state.positions,
      [step.outputs.position.id.id]: step.outputs.position,
    },
    steps: [...state.steps, step],
  }
}
