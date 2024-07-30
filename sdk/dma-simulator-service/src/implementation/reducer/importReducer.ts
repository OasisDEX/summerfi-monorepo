import { DMASimulationState } from '../../interfaces/DMASimulationState'
import { ImportStep } from '../DMASimulatorSteps'

export function importReducer(step: ImportStep, state: DMASimulationState): DMASimulationState {
  return {
    ...state,
    steps: [...state.steps, step],
  }
}
