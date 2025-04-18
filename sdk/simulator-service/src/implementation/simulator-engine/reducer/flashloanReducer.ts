import { steps } from '@summerfi/sdk-common'
import { addBalance } from '../../utils'
import { ISimulationState } from '../../../interfaces/simulation'

export function flashloanReducer(
  step: steps.FlashloanStep,
  state: ISimulationState,
): ISimulationState {
  return {
    ...state,
    steps: [...state.steps, step],
    balances: addBalance(step.inputs.amount, state.balances),
  }
}
