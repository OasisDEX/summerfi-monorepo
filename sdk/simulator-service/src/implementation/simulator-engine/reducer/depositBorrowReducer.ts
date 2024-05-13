import { borrowFromPosition, depositToPosition } from '@summerfi/sdk-common/common/utils'
import { steps } from '@summerfi/sdk-common/simulation'
import { addBalance, subtractBalance, getValueFromReference } from '../../utils'
import { ISimulationState } from '../../../interfaces/simulation'

export function depositBorrowReducer(
  step: steps.DepositBorrowStep,
  state: ISimulationState,
): ISimulationState {
  const afterDeposit = subtractBalance(
    getValueFromReference(step.inputs.depositAmount),
    state.balances,
  )
  const afterBorrow = addBalance(getValueFromReference(step.inputs.borrowAmount), afterDeposit)

  return {
    ...state,
    positions: {
      ...state.positions,
      [step.inputs.position.id.id]: borrowFromPosition(
        depositToPosition(step.inputs.position, getValueFromReference(step.inputs.depositAmount)),
        getValueFromReference(step.inputs.borrowAmount),
      ),
    },
    steps: [
      ...state.steps,
      step,
    ],
    balances: afterBorrow,
  }
}
