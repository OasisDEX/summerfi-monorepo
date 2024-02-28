import { depositToPosition } from '@summerfi/sdk-common/common/utils'
import { steps } from '@summerfi/sdk-common/simulation'
import {
  addBalance,
  getReferencedValue,
  subtractBalance,
} from '~swap-service/implementation/helpers'
import { SimulationState } from '~swap-service/interfaces/simulation'

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
      [step.inputs.position.positionId.id]: depositToPosition(
        step.inputs.position,
        getReferencedValue(step.inputs.withdrawAmount),
      ),
    },
    steps: {
      [step.name]: step,
    },
    balances: afterWithdraw,
  }
}
