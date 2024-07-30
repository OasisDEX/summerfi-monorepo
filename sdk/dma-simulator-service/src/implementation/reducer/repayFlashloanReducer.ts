import { DMASimulationState } from '../../interfaces/DMASimulationState'
import { subtractBalance } from '../../utils/BalanceUtils'
import { RepayFlashloanStep } from '../DMASimulatorSteps'

export function repayFlashloanReducer(
  step: RepayFlashloanStep,
  state: DMASimulationState,
): DMASimulationState {
  return {
    ...state,
    steps: [...state.steps, step],
    balances: subtractBalance(step.inputs.amount, state.balances),
  }
}
