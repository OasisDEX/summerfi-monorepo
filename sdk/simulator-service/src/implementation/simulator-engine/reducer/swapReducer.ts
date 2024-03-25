import { steps } from '@summerfi/sdk-common/simulation'
import { addBalance, subtractBalance } from '../../helpers'
import { SimulationState } from '../../../interfaces/simulation'

export function swapReducer(step: steps.SwapStep, state: SimulationState): SimulationState {
  const balanceWithoutFromToken = subtractBalance(step.inputs.fromTokenAmount, state.balances)
  const balanceWithToToken = addBalance(step.outputs.receivedAmount, balanceWithoutFromToken)
  step.inputs.fromTokenAmount
  return {
    ...state,
    steps: {
      ...state.steps,
      [step.name]: step,
    },
    swaps: {
      ...state.swaps,
      [step.name]: {
        provider: step.inputs.provider,
        routes: step.inputs.routes,
        fromTokenAmount: step.inputs.fromTokenAmount,
        toTokenAmount: step.inputs.toTokenAmount,
        slippage: step.inputs.slippage,
        fee: step.inputs.fee
      }
    },
    balances: balanceWithToToken,
  }
}