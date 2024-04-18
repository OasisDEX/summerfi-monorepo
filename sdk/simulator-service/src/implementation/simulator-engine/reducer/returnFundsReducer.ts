import { steps } from '@summerfi/sdk-common/simulation'
import { getTokenBalance, subtractBalance } from '../../utils'
import { ISimulationState } from '../../../interfaces/simulation'

export function returnFundsReducer(
  step: steps.ReturnFundsStep,
  state: ISimulationState,
): ISimulationState {
  return {
    ...state,
    steps: {
      ...state.steps,
      [step.name]: step,
    },
    balances: subtractBalance(getTokenBalance(step.inputs.token, state.balances), state.balances),
  }
}
