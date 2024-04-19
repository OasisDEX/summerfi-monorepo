import { applyPercentage } from "@summerfi/sdk-common/utils"
import type { ChainInfo, Percentage, Token, TokenAmount } from "@summerfi/sdk-common/common/implementation"
import { steps } from "@summerfi/sdk-common/simulation"
import type { ISwapManager } from "@summerfi/swap-common/interfaces"

export async function getSwapStepData(params: {
    chainInfo: ChainInfo
    fromAmount: TokenAmount
    toToken: Token
    slippage: Percentage
    swapManager: ISwapManager
  }): Promise<steps.SwapStep['inputs']> {
    const summerFee = await params.swapManager.getSummerFee({
      from: { token: params.fromAmount.token },
      to: { token: params.toToken }
    })

    const summerFeeAmount = applyPercentage(params.fromAmount, summerFee)
    const amountAfterSummerFee = params.fromAmount.subtract(summerFeeAmount)

    // Deduct summer fee from fromAmount
    // Call swapProvider with new amount
    // at last we need to return from amount with summer fee
    // 
    
    const [
      quote,
      spotPrice,
    ] = await Promise.all([
      params.swapManager.getSwapQuoteExactInput({
        chainInfo: params.chainInfo,
        fromAmount: amountAfterSummerFee,
        toToken: params.toToken,
      }),
      params.swapManager.getSpotPrice({
        chainInfo: params.chainInfo,
        baseToken: params.toToken,
        quoteToken: params.fromAmount.token,
      })
    ])

    return {
      ...quote,
      fromTokenAmount: params.fromAmount,
      swappedAmount: amountAfterSummerFee,
      summerFee,
      spotPrice: spotPrice.price,
      slippage: params.slippage,
    }
  }