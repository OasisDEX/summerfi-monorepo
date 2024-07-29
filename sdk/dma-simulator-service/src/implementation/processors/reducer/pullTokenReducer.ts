import { steps } from '@summerfi/sdk-common/simulation'
import { ISimulationState } from '../../../interfaces/DMASimulationState'
import { addBalance, getValueFromReference } from '../../utils'

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
