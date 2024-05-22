import { borrowFromPosition, depositToPosition } from '@summerfi/sdk-common/common/utils'
import { steps } from '@summerfi/sdk-common/simulation'
import { addBalance, subtractBalance, getValueFromReference } from '../../utils'
import { ISimulationState } from '../../../interfaces/simulation'

export function depositBorrowReducer(
  step: steps.DepositBorrowStep,
  state: ISimulationState,
): ISimulationState {
  const depositAmount = getValueFromReference(step.inputs.depositAmount)
  const borrowAmount = getValueFromReference(step.inputs.borrowAmount)
  const afterDeposit = subtractBalance(depositAmount, state.balances)
  const afterBorrow = addBalance(borrowAmount, afterDeposit)

  return {
    ...state,
    positions: {
      ...state.positions,
      [step.inputs.position.id.id]: borrowFromPosition(
        depositToPosition(step.inputs.position, depositAmount),
        borrowAmount,
      ),
    },
    steps: [...state.steps, step],
    balances: afterBorrow,
  }
}
