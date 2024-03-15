import { steps } from '@summerfi/sdk-common/simulation'
import { SimulationState } from '../../../interfaces/simulation'
import { getTokenBalance, subtractBalance } from '../../helpers'

export function returnFundsReducer(
  step: steps.ReturnFunds,
  state: SimulationState,
): SimulationState {
  return {
    ...state,
    steps: {
      [step.name]: step,
    },
    balances: subtractBalance(getTokenBalance(step.inputs.token, state.balances), state.balances),
  }
}
