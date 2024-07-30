import { DMASimulationState } from '../../interfaces/DMASimulationState'
import { getTokenBalance, subtractBalance } from '../../utils/BalanceUtils'
import { ReturnFundsStep } from '../DMASimulatorSteps'

export function returnFundsReducer(
  step: ReturnFundsStep,
  state: DMASimulationState,
): DMASimulationState {
  return {
    ...state,
    steps: [...state.steps, step],
    balances: subtractBalance(getTokenBalance(step.inputs.token, state.balances), state.balances),
  }
}
