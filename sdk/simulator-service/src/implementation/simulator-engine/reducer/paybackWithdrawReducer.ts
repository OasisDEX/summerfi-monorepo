import { depositToPosition } from '@summerfi/sdk-common/common/utils'
import { steps } from '@summerfi/sdk-common/simulation'
import {
  addBalance,
  getReferencedValue,
  subtractBalance,
} from '../../helpers'
import { SimulationState } from '../../../interfaces/simulation'

export function paybackWithdrawReducer(
  step: steps.PaybackWithdrawStep,
  state: SimulationState,
): SimulationState {
  const afterPayback = addBalance(getReferencedValue(step.inputs.paybackAmount), state.balances)
  const afterWithdraw = subtractBalance(
    getReferencedValue(step.inputs.withdrawAmount),
    afterPayback,
  )
  return {
    ...state,
    positions: {
      ...state.positions,
      [step.inputs.position.positionId.id]: depositToPosition(
        step.inputs.position,
        getReferencedValue(step.inputs.withdrawAmount),
      ),
    },
    steps: {
      ...state.steps,
      [step.name]: step,
    },
    balances: afterWithdraw,
  }
}
