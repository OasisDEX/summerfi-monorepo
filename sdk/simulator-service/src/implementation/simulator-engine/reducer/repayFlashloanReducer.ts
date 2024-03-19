import { steps } from '@summerfi/sdk-common/simulation'
import { SimulationState } from '../../../interfaces/simulation'
import { subtractBalance } from '../../helpers'

export function repayFlashloanReducer(
  step: steps.RepayFlashloan,
  state: SimulationState,
): SimulationState {
  return {
    ...state,
    steps: {
      [step.name]: step,
    },
    balances: subtractBalance(step.inputs.amount, state.balances),
  }
}
