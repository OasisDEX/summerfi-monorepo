import { TokenAmount, Price, Percentage } from '@summerfi/sdk-common/common'
import { steps } from '@summerfi/sdk-common/simulation'
import { addBalance, subtractBalance } from '../../utils'
import { ISimulationState } from '../../../interfaces/simulation'

export function swapReducer(step: steps.SwapStep, state: ISimulationState): ISimulationState {
  const balanceWithoutFromToken = subtractBalance(step.inputs.inputAmount, state.balances)
  const balanceWithToToken = addBalance(step.outputs.received, balanceWithoutFromToken)
  const fromAmountPreSummerFee = step.inputs.inputAmount.divide(
    Percentage.createFrom({ value: 1 }).subtract(step.inputs.summerFee),
  )

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
    },
    balances: balanceWithToToken,
  }
}

/**
 *
 * @param marketPrice - This price represents a blend of spot prices from various exchanges.
 * @param offerPrice - The offer price is price quoted to us by a liquidity provider and takes
 *      into account price impact - where price impact is a measure of how much our trade
 *      affects the price. It is determined by the breadth and depth of liquidity.
 */
export function calculatePriceImpact(marketPrice: Price, offerPrice: Price): Percentage {
  return Percentage.createFrom({
    value: marketPrice
      .toBN()
      .minus(offerPrice.toBN())
      .div(marketPrice.toBN())
      .abs()
      .times(100)
      .toNumber(),
  })
}
