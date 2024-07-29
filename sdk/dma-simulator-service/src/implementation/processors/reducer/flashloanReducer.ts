import { steps } from '@summerfi/sdk-common/simulation'
import { ISimulationState } from '../../../interfaces/DMASimulationState'
import { addBalance } from '../../utils'

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
