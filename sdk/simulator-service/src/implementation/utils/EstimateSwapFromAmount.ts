import { TokenAmount, ITokenAmount, IToken, IPercentage } from '@summerfi/sdk-common/common'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { BigNumber } from 'bignumber.js'
import { IOracleManager } from '@summerfi/oracle-common'

/**
 * EstimateTokenAmountAfterSwap
 * @description Estimates how much you will receive after swap.
 *    If target token is the same as source token, we return the same amount.
 *    When we perform a swap, we need to account for the summer fee,
 *    and we assume maximum slippage.
 */
export async function estimateSwapFromAmount(params: {
  receiveAtLeast: ITokenAmount
  fromToken: IToken
  slippage: IPercentage
  swapManager: ISwapManager
  oracleManager: IOracleManager
}): Promise<ITokenAmount> {
  const { receiveAtLeast, slippage } = params

  if (receiveAtLeast.token.equals(params.fromToken)) {
    return receiveAtLeast
  }

  const spotPrice = (
    await params.oracleManager.getSpotPrice({
      baseToken: receiveAtLeast.token,
      quoteToken: params.fromToken,
    })
  ).price

  const summerFee = await params.swapManager.getSummerFee({
    from: { token: receiveAtLeast.token },
    to: { token: params.fromToken },
  })

  const ONE = new BigNumber(1)
  /*
  TargetAmt = SourceAmt * (1 - SummerFee) / (SpotPrice * (1 + Slippage))
  SourceAmt = TargetAmt * SpotPrice * (1 + Slippage) / (1 - SummerFee)
  */
  const sourceAmount = receiveAtLeast
    .toBN()
    .multipliedBy(spotPrice.toBN().times(ONE.plus(slippage.toProportion())))
    .div(ONE.minus(summerFee.toProportion()))

  return TokenAmount.createFrom({
    amount: sourceAmount.toString(),
    token: params.fromToken,
  })
}
