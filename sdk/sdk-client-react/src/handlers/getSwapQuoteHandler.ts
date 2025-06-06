import type { ISDKManager } from '@summer_fi/sdk-client'
import { type IToken, Percentage, TokenAmount } from '@summer_fi/sdk-client'

export const getSwapQuoteHandler =
  (sdk: ISDKManager) =>
  async ({
    fromAmount,
    fromToken,
    toToken,
    slippage,
  }: {
    fromAmount: string
    fromToken: IToken
    toToken: IToken
    slippage: number
  }) => {
    const position = await sdk.swaps.getSwapQuoteExactInput({
      fromAmount: TokenAmount.createFrom({ token: fromToken, amount: fromAmount }),
      toToken: toToken,
      slippage: Percentage.createFrom({ value: slippage }),
    })
    return position
  }
