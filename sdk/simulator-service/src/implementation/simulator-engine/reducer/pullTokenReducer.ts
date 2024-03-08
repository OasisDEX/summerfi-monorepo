import { steps } from '@summerfi/sdk-common/simulation'
import { addBalance, getReferencedValue } from '~simulator-service/implementation/helpers'
import { SimulationState } from '~simulator-service/interfaces/simulation'

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
