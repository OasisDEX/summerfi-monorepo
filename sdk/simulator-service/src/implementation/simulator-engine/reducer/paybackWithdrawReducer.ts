import { depositToPosition } from '@summerfi/sdk-common/common/utils'
import { steps } from '@summerfi/sdk-common/simulation'
import { addBalance, getValueFromReference, subtractBalance } from '../../utils'
import { ISimulationState } from '../../../interfaces/simulation'

export function paybackWithdrawReducer(
  step: steps.PaybackWithdrawStep,
  state: ISimulationState,
): ISimulationState {
  const afterPayback = addBalance(getValueFromReference(step.inputs.paybackAmount), state.balances)
  const afterWithdraw = subtractBalance(
    getValueFromReference(step.inputs.withdrawAmount),
    afterPayback,
  )
  return {
    ...state,
    positions: {
      ...state.positions,
      [step.inputs.position.id.id]: depositToPosition(
        step.inputs.position,
        getValueFromReference(step.inputs.withdrawAmount),
      ),
    },
    steps: [...state.steps, step],
    balances: afterWithdraw,
  }
}
