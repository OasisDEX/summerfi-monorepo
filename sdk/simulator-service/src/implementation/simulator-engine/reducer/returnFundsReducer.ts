import { steps } from '@summerfi/sdk-common'
import { getTokenBalance, subtractBalance } from '../../utils'
import { ISimulationState } from '../../../interfaces/simulation'

export function returnFundsReducer(
  step: steps.ReturnFundsStep,
  state: ISimulationState,
): ISimulationState {
  return {
    ...state,
    steps: [...state.steps, step],
    balances: subtractBalance(getTokenBalance(step.inputs.token, state.balances), state.balances),
  }
}
