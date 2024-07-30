import { getValueFromReference } from '@summerfi/simulator-common/interfaces'
import { DMASimulationState } from '../../interfaces'
import { addBalance } from '../../utils/BalanceUtils'
import { PullTokenStep } from '../DMASimulatorSteps'

export function pullTokenReducer(
  step: PullTokenStep,
  state: DMASimulationState,
): DMASimulationState {
  return {
    ...state,
    steps: [...state.steps, step],
    balances: addBalance(getValueFromReference(step.inputs.amount), state.balances),
  }
}
