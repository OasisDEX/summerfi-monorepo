import { DMASimulationState } from '../../interfaces/DMASimulationState'
import { NewPositionEventStep } from '../DMASimulatorSteps'

export function newPositionEventReducer(
  step: NewPositionEventStep,
  state: DMASimulationState,
): DMASimulationState {
  return {
    ...state,
    steps: [...state.steps, step],
  }
}
