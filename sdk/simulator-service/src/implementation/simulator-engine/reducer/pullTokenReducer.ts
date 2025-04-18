import { steps } from '@summerfi/sdk-common'
import { addBalance, getValueFromReference } from '../../utils'
import { ISimulationState } from '../../../interfaces/simulation'

export function pullTokenReducer(
  step: steps.PullTokenStep,
  state: ISimulationState,
): ISimulationState {
  return {
    ...state,
    steps: [...state.steps, step],
    balances: addBalance(getValueFromReference(step.inputs.amount), state.balances),
  }
}
