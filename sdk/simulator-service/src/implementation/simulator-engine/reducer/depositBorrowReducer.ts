import { borrowFromPosition, depositToPosition } from '@summerfi/sdk-common/common/utils'
import { steps } from '@summerfi/sdk-common/simulation'
import { SimulationState } from '../../../interfaces/simulation'
import { addBalance, getReferencedValue, subtractBalance } from '../../helpers'

export function depositBorrowReducer(
  step: steps.DepositBorrowStep,
  state: SimulationState,
): SimulationState {
  const afterDeposit = subtractBalance(
    getReferencedValue(step.inputs.depositAmount),
    state.balances,
  )
  const afterBorrow = addBalance(getReferencedValue(step.inputs.borrowAmount), afterDeposit)
  return {
    ...state,
    positions: {
      [step.inputs.position.positionId.id]: borrowFromPosition(
        depositToPosition(step.inputs.position, getReferencedValue(step.inputs.depositAmount)),
        getReferencedValue(step.inputs.borrowAmount),
      ),
    },
    steps: {
      [step.name]: step,
    },
    balances: afterBorrow,
  }
}
