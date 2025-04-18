import { z } from 'zod'
import { Token, TokenAmount, Address, Percentage, SwapData } from '@summerfi/sdk-common'
import { publicProcedure } from '../SDKTRPC'

export const getSwapDataExactInput = publicProcedure
  .input(
    z.object({
      fromAmount: z.custom<TokenAmount>((tokenAmount) => tokenAmount !== undefined),
      toToken: z.custom<Token>((token) => token !== undefined),
      recipient: z.custom<Address>((recipient) => recipient !== undefined),
      slippage: z.custom<Percentage>((slippage) => slippage !== undefined),
    }),
  )
  .query(async (opts): Promise<SwapData> => {
    return await opts.ctx.swapManager.getSwapDataExactInput({
      fromAmount: opts.input.fromAmount,
      toToken: opts.input.toToken,
      recipient: opts.input.recipient,
      slippage: opts.input.slippage,
    })
  })
