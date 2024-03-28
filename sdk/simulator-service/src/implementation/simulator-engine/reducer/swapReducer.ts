import { TokenAmount, Price, Percentage } from '@summerfi/sdk-common/common'
import { applyPercentage } from '@summerfi/sdk-common/utils'
import { steps } from '@summerfi/sdk-common/simulation'
import { addBalance, subtractBalance } from '../../utils'
import { ISimulationState } from '../../../interfaces/simulation'

export function swapReducer(step: steps.SwapStep, state: ISimulationState): ISimulationState {
  const balanceWithoutFromToken = subtractBalance(step.inputs.fromTokenAmount, state.balances)
  const balanceWithToToken = addBalance(step.outputs.receivedAmount, balanceWithoutFromToken)

  const baseToken = step.inputs.toTokenAmount.token
  const quoteToken = step.inputs.fromTokenAmount.token

  // We require both from & to be at similar decimal precisions
  const offerPrice = Price.createFrom({
    value: step.inputs.toTokenAmount
      .fromBaseUnitAsBn()
      .div(step.inputs.fromTokenAmount.fromBaseUnitAsBn())
      .toString(),
    baseToken,
    quoteToken,
  })

  const spotPrice = step.inputs.spotPrice
  const fromAmountPreSummerFee = applyPercentage(step.inputs.fromTokenAmount, step.inputs.summerFee)

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
        fromTokenAmount: step.inputs.fromTokenAmount,
        toTokenAmount: step.inputs.toTokenAmount,
        slippage: Percentage.createFrom({ value: step.inputs.slippage.value }),
        offerPrice,
        spotPrice,
        priceImpact: calculatePriceImpact(spotPrice, offerPrice),
        summerFee: TokenAmount.createFrom({
          token: step.inputs.fromTokenAmount.token,
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
