import { steps } from '@summerfi/sdk-common/simulation'
import { getTokenBalance, subtractBalance } from '~simulator-service/implementation/helpers'
import { SimulationState } from '~simulator-service/interfaces/simulation'

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
