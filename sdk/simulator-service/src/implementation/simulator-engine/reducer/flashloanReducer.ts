import { steps } from '@summerfi/sdk-common/simulation'
import { addBalance } from '../../helpers'
import { SimulationState } from '../../../interfaces/simulation'

export function flashloanReducer(
  step: steps.FlashloanStep,
  state: SimulationState,
): SimulationState {
  return {
    ...state,
    steps: {
      ...state.steps,
      [step.name]: step,
    },
    balances: addBalance(step.inputs.amount, state.balances),
  }
}
