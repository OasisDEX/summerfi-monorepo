import { DMASimulationState } from '../../interfaces/DMASimulationState'
import { addBalance } from '../../utils/BalanceUtils'
import { FlashloanStep } from '../DMASimulatorSteps'

export function flashloanReducer(
  step: FlashloanStep,
  state: DMASimulationState,
): DMASimulationState {
  return {
    ...state,
    steps: [...state.steps, step],
    balances: addBalance(step.inputs.amount, state.balances),
  }
}
