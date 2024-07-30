import { getValueFromReference } from '@summerfi/simulator-common/interfaces'
import { DMASimulationState } from '../../interfaces/DMASimulationState'
import { addBalance, subtractBalance } from '../../utils/BalanceUtils'
import { depositToPosition } from '../../utils/PositionUtils'
import { PaybackWithdrawStep } from '../DMASimulatorSteps'

export function paybackWithdrawReducer(
  step: PaybackWithdrawStep,
  state: DMASimulationState,
): DMASimulationState {
  const paybackAmount = getValueFromReference(step.inputs.paybackAmount)
  const withdrawAmount = getValueFromReference(step.inputs.withdrawAmount)
  const afterPayback = subtractBalance(paybackAmount, state.balances)
  const afterWithdraw = addBalance(withdrawAmount, afterPayback)
  return {
    ...state,
    positions: {
      ...state.positions,
      [step.inputs.position.id.id]: depositToPosition(step.inputs.position, withdrawAmount),
    },
    steps: [...state.steps, step],
    balances: afterWithdraw,
  }
}
