import { steps } from '@summerfi/sdk-common/simulation'
import { addBalance } from '../../utils'
import { ISimulationState } from '../../../interfaces/simulation'

export function flashloanReducer(
  step: steps.FlashloanStep,
  state: ISimulationState,
): ISimulationState {
  return {
    ...state,
    steps: {
      ...state.steps,
      [step.name]: step,
    },
    balances: addBalance(step.inputs.amount, state.balances),
  }
}
