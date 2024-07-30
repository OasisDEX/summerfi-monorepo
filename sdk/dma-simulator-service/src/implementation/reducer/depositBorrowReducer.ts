import { getValueFromReference } from '@summerfi/simulator-common/interfaces'
import { DMASimulationState } from '../../interfaces/DMASimulationState'
import { addBalance, subtractBalance } from '../../utils/BalanceUtils'
import { borrowFromPosition, depositToPosition } from '../../utils/PositionUtils'
import { DepositBorrowStep } from '../DMASimulatorSteps'

export function depositBorrowReducer(
  step: DepositBorrowStep,
  state: DMASimulationState,
): DMASimulationState {
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
