import { DMASimulationState } from '../../interfaces/DMASimulationState'
import { OpenPosition } from '../DMASimulatorSteps'

export function openPositionReducer(
  step: OpenPosition,
  state: DMASimulationState,
): DMASimulationState {
  return {
    ...state,
    positions: {
      ...state.positions,
      [step.outputs.position.id.id]: step.outputs.position,
    },
    steps: [...state.steps, step],
  }
}
