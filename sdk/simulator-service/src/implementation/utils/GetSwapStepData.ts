import { Price } from '@summerfi/sdk-common'
import { steps } from '@summerfi/sdk-common/simulation'
import type { ISwapManager } from '@summerfi/swap-common/interfaces'
import { IOracleManager } from '@summerfi/oracle-common'
import { IChainInfo, IPercentage, IToken, ITokenAmount } from '@summerfi/sdk-common/common'

export async function getSwapStepData(params: {
  chainInfo: IChainInfo
  fromAmount: ITokenAmount
  toToken: IToken
  slippage: IPercentage
  swapManager: ISwapManager
  oracleManager: IOracleManager
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
      fromAmount: amountAfterSummerFee,
      toToken: params.toToken,
    }),
    params.oracleManager.getSpotPrice({
      baseToken: params.toToken,
      denomination: params.fromAmount.token,
    }),
  ])

  // Actual price offered by the swap service
  const offerPrice = Price.createFrom({
    value: params.fromAmount.divide(quote.toTokenAmount.amount).amount,
    base: params.toToken,
    quote: params.fromAmount.token,
  })

  const minimumReceivedAmount = quote.toTokenAmount.multiply(params.slippage.toComplement())

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
