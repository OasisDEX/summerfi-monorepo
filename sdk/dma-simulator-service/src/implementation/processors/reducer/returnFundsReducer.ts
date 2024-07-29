import { steps } from '@summerfi/sdk-common/simulation'
import { ISimulationState } from '../../../interfaces/DMASimulationState'
import { getTokenBalance, subtractBalance } from '../../utils'

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
