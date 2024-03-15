import { borrowFromPosition, depositToPosition } from '@summerfi/sdk-common/common/utils'
import { steps } from '@summerfi/sdk-common/simulation'
import {
  addBalance,
  getReferencedValue,
  subtractBalance,
} from '../../helpers'
import { SimulationState } from '../../../interfaces/simulation'

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
      ...state.positions,
      [step.inputs.position.positionId.id]: borrowFromPosition(
        depositToPosition(step.inputs.position, getReferencedValue(step.inputs.depositAmount)),
        getReferencedValue(step.inputs.borrowAmount),
      ),
    },
    steps: {
      ...state.steps,
      [step.name]: step,
    },
    balances: afterBorrow,
  }
}
