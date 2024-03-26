import { TokenAmount, Price, Percentage } from '@summerfi/sdk-common/common'
import { steps } from '@summerfi/sdk-common/simulation'
import { addBalance, subtractBalance } from '../../utils'
import { ISimulationState } from '../../../interfaces/simulation'

export function swapReducer(step: steps.SwapStep, state: ISimulationState): ISimulationState {
  const balanceWithoutFromToken = subtractBalance(step.inputs.fromTokenAmount, state.balances)
  const balanceWithToToken = addBalance(step.outputs.receivedAmount, balanceWithoutFromToken)

  const baseToken = step.inputs.toTokenAmount.token
  const quoteToken = step.inputs.fromTokenAmount.token

  const offerPrice = Price.createFrom({
    value: step.inputs.toTokenAmount
      .toBaseUnitAsBn()
      .div(step.inputs.fromTokenAmount.toBaseUnitAsBn())
      .toString(),
    baseToken,
    quoteToken,
  })

  const spotPriceOfToToken = step.inputs.prices.find((price) =>
    price.baseToken.address.equals(baseToken.address),
  )
  const spotPriceOfFromToken = step.inputs.prices.find((price) =>
    price.baseToken.address.equals(quoteToken.address),
  )

  if (!spotPriceOfToToken || !spotPriceOfFromToken) {
    throw new Error('Spot price for either From/To token could not be found')
  }

  const marketPrice = Price.createFrom({
    value: spotPriceOfToToken.toBN().div(spotPriceOfFromToken.toBN()).toString(),
    baseToken: step.inputs.fromTokenAmount.token,
    quoteToken: step.inputs.toTokenAmount.token,
  })

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
        fromTokenAmount: step.inputs.fromTokenAmount,
        toTokenAmount: step.inputs.toTokenAmount,
        slippage: step.inputs.slippage,
        offerPrice,
        marketPrice,
        priceImpact: calculatePriceImpact(marketPrice, offerPrice),
        summerFee: TokenAmount.createFrom({
          token: step.inputs.fromTokenAmount.token,
          amount: step.inputs.fromTokenAmount.multiply(step.inputs.fee.value).amount,
        }),
      },
    },
    balances: balanceWithToToken,
  }
}

/**
 *
 * @param marketPrice - This price represent how much it will cost for selling some very small amount
 * such as 0.1. It is the best possible price on the market.
 * @param offerPrice - If the amount we would like to sell we might get deeper into the liquidity
 * meaning the price won't be a good as when you sell small amount. This is the price that is
 * represent how much it will cost for us to sell the desired amount.
 *
 * Both prices might be equal which means that there is no price impact. Having no
 * price impact means that you sell at the best possible price.
 */
export function calculatePriceImpact(marketPrice: Price, offerPrice: Price): Percentage {
  return Percentage.createFrom({
    percentage: marketPrice
      .toBN()
      .minus(offerPrice.toBN())
      .div(marketPrice.toBN())
      .abs()
      .times(100)
      .toNumber(),
  })
}
