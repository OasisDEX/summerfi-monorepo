import { steps } from '@summerfi/sdk-common/simulation'
import { addBalance, getReferencedValue } from '../../helpers'
import { SimulationState } from '../../../interfaces/simulation'

export function pullTokenReducer(
  step: steps.PullTokenStep,
  state: SimulationState,
): SimulationState {
  return {
    ...state,
    steps: {
      ...state.steps,
      [step.name]: step,
    },
    balances: addBalance(getReferencedValue(step.inputs.amount), state.balances),
  }
}
