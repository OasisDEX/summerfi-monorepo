import { steps } from '@summerfi/sdk-common/simulation'
import { ISimulationState } from '../../../interfaces/DMASimulationState'

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
