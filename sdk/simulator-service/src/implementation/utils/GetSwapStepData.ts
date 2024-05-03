import { Price } from '@summerfi/sdk-common'
import type {
  ChainInfo,
  Percentage,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common/common/implementation'
import { steps } from '@summerfi/sdk-common/simulation'
import type { ISwapManager } from '@summerfi/swap-common/interfaces'

export async function getSwapStepData(params: {
  chainInfo: ChainInfo
  fromAmount: TokenAmount
  toToken: Token
  slippage: Percentage
  swapManager: ISwapManager
}): Promise<steps.SwapStep['inputs']> {
  const summerFee = await params.swapManager.getSummerFee({
    from: { token: params.fromAmount.token },
    to: { token: params.toToken },
  })

  /*
  From amount already includes our fee, so we need to calculate the amount before our fee
    FROM = X + X * FEE
    FROM = X (1 + FEE)
    X = FROM / (1 + FEE)

    OURFEE = X * FEE
    OURFEE = FROM * FEE / (1 + FEE)
  */

  const feeAsProportion = summerFee.toProportion()
  const summerFeeAmount = params.fromAmount.multiply(feeAsProportion).divide(feeAsProportion + 1)
  const amountAfterSummerFee = params.fromAmount.subtract(summerFeeAmount)

  const [quote, spotPrice] = await Promise.all([
    params.swapManager.getSwapQuoteExactInput({
      chainInfo: params.chainInfo,
      fromAmount: amountAfterSummerFee,
      toToken: params.toToken,
    }),
    params.swapManager.getSpotPrice({
      chainInfo: params.chainInfo,
      baseToken: params.toToken,
      quoteToken: params.fromAmount.token,
    }),
  ])

  // Actual price offered by the swap service
  const offerPrice = Price.createFrom({
    value: params.fromAmount.divide(quote.toTokenAmount.amount).amount,
    baseToken: params.toToken,
    quoteToken: params.fromAmount.token,
  })

  const minimumReceivedAmount = quote.toTokenAmount.multiply(1.0 - params.slippage.toProportion())

  return {
    provider: quote.provider,
    routes: quote.routes,
    spotPrice: spotPrice.price,
    offerPrice: offerPrice,
    inputAmount: params.fromAmount,
    inputAmountAfterFee: amountAfterSummerFee,
    estimatedReceivedAmount: quote.toTokenAmount,
    minimumReceivedAmount: minimumReceivedAmount,
    slippage: params.slippage,
    summerFee: summerFee,
  }
}
