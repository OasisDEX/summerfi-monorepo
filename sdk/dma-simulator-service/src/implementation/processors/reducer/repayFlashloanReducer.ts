import { steps } from '@summerfi/sdk-common/simulation'
import { ISimulationState } from '../../../interfaces/DMASimulationState'
import { subtractBalance } from '../../utils'

export function repayFlashloanReducer(
  step: steps.RepayFlashloanStep,
  state: ISimulationState,
): ISimulationState {
  return {
    ...state,
    steps: [...state.steps, step],
    balances: subtractBalance(step.inputs.amount, state.balances),
  }
}
