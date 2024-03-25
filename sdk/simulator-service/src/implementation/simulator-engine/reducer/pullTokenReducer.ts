import { steps } from '@summerfi/sdk-common/simulation'
import { addBalance, getReferencedValue } from '../../utils'
import { ISimulationState } from '../../../interfaces/simulation'

export function pullTokenReducer(
  step: steps.PullTokenStep,
  state: ISimulationState,
): ISimulationState {
  return {
    ...state,
    steps: {
      ...state.steps,
      [step.name]: step,
    },
    balances: addBalance(getReferencedValue(step.inputs.amount), state.balances),
  }
}
