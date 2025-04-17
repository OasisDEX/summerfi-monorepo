import { Percentage, TokenAmount, steps, calculatePriceImpact } from '@summerfi/sdk-common'
import { ISimulationState } from '../../../interfaces/simulation'
import { addBalance, subtractBalance } from '../../utils'

export function swapReducer(step: steps.SwapStep, state: ISimulationState): ISimulationState {
  const balanceWithoutFromToken = subtractBalance(step.inputs.inputAmount, state.balances)
  const balanceWithToToken = addBalance(step.outputs.received, balanceWithoutFromToken)
  const fromAmountPreSummerFee = step.inputs.inputAmount.divide(
    Percentage.createFrom({ value: 100.0 }).subtract(step.inputs.summerFee),
  )

  return {
    ...state,
    steps: [...state.steps, step],
    swaps: [
      ...state.swaps,
      {
        provider: step.inputs.provider,
        // Note: Can add routes back in later if we need them for the UI
        // routes: step.inputs.routes,
        // SummerFee should already have been subtracted by this stage
        // Should be subtracted from `from` amount when getting swap quote in simulator
        fromTokenAmount: step.inputs.inputAmount,
        toTokenAmount: step.inputs.estimatedReceivedAmount,
        slippage: Percentage.createFrom({ value: step.inputs.slippage.value }),
        offerPrice: step.inputs.offerPrice,
        spotPrice: step.inputs.spotPrice,
        priceImpact: calculatePriceImpact(step.inputs.spotPrice, step.inputs.offerPrice),
        summerFee: TokenAmount.createFrom({
          token: step.inputs.inputAmount.token,
          amount: fromAmountPreSummerFee.multiply(step.inputs.summerFee.toProportion()).amount,
        }),
      },
    ],
    balances: balanceWithToToken,
  }
}
