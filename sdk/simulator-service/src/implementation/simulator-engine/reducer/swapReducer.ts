import { steps } from '@summerfi/sdk-common/simulation'
import { addBalance, subtractBalance } from '../../helpers'
import { SimulationState } from '../../../interfaces/simulation'

export function swapReducer(step: steps.SwapStep, state: SimulationState): SimulationState {
  const balanceWithoutFromToken = subtractBalance(step.inputs.fromTokenAmount, state.balances)
  const balanceWithToToken = addBalance(step.outputs.receivedAmount, balanceWithoutFromToken)
  return {
    ...state,
    steps: {
      ...state.steps,
      [step.name]: step,
    },
    balances: balanceWithToToken,
  }
}
