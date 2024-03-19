import { steps } from '@summerfi/sdk-common/simulation'
import { SimulationState } from '../../../interfaces/simulation'
import { addBalance, getReferencedValue } from '../../helpers'

export function pullTokenReducer(
  step: steps.PullTokenStep,
  state: SimulationState,
): SimulationState {
  return {
    ...state,
    steps: {
      [step.name]: step,
    },
    balances: addBalance(getReferencedValue(step.inputs.amount), state.balances),
  }
}
