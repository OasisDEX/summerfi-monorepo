import { steps } from '@summerfi/sdk-common/simulation'
import { subtractBalance } from '../../utils'
import { ISimulationState } from '../../../interfaces/simulation'

export function repayFlashloanReducer(
  step: steps.RepayFlashloan,
  state: ISimulationState,
): ISimulationState {
  return {
    ...state,
    steps: {
      ...state.steps,
      [step.name]: step,
    },
    balances: subtractBalance(step.inputs.amount, state.balances),
  }
}
