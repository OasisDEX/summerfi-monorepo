import { steps } from '@summerfi/sdk-common/simulation'
import { getTokenBalance, subtractBalance } from '../../helpers'
import { SimulationState } from '../../../interfaces/simulation'

export function returnFundsReducer(
  step: steps.ReturnFunds,
  state: SimulationState,
): SimulationState {
  return {
    ...state,
    steps: {
      ...state.steps,
      [step.name]: step,
    },
    balances: subtractBalance(getTokenBalance(step.inputs.token, state.balances), state.balances),
  }
}
