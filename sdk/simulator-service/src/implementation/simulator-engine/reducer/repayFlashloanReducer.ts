import { steps } from '@summerfi/sdk-common'
import { subtractBalance } from '../../utils'
import { ISimulationState } from '../../../interfaces/simulation'

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
