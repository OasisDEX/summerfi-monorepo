import { steps } from '@summerfi/sdk-common/simulation'
import { subtractBalance } from '~simulator-service/implementation/helpers'
import { SimulationState } from '~simulator-service/interfaces/simulation'

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
