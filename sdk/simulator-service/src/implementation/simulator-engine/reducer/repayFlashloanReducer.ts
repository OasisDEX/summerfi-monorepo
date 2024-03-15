import { steps } from '@summerfi/sdk-common/simulation'
import { subtractBalance } from '../../helpers'
import { SimulationState } from '../../../interfaces/simulation'

export function repayFlashloanReducer(
  step: steps.RepayFlashloan,
  state: SimulationState,
): SimulationState {
  return {
    ...state,
    steps: {
      ...state.steps,
      [step.name]: step,
    },
    balances: subtractBalance(step.inputs.amount, state.balances),
  }
}
