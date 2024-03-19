import { steps } from '@summerfi/sdk-common/simulation'
import { SimulationState } from '../../../interfaces/simulation'
import { addBalance } from '../../helpers'

export function flashloanReducer(
  step: steps.FlashloanStep,
  state: SimulationState,
): SimulationState {
  return {
    ...state,
    steps: {
      [step.name]: step,
    },
    balances: addBalance(step.inputs.amount, state.balances),
  }
}
