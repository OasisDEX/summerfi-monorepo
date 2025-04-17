import { depositToPosition, steps } from '@summerfi/sdk-common'
import { addBalance, getValueFromReference, subtractBalance } from '../../utils'
import { ISimulationState } from '../../../interfaces/simulation'

export function paybackWithdrawReducer(
  step: steps.PaybackWithdrawStep,
  state: ISimulationState,
): ISimulationState {
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
