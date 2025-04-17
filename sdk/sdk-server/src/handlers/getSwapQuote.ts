import { z } from 'zod'
import { Token, TokenAmount, QuoteData, Percentage } from '@summerfi/sdk-common'
import { publicProcedure } from '../SDKTRPC'

export const getSwapQuoteExactInput = publicProcedure
  .input(
    z.object({
      fromAmount: z.custom<TokenAmount>((tokenAmount) => tokenAmount !== undefined),
      toToken: z.custom<Token>((token) => token !== undefined),
      slippage: z.custom<Percentage>((tokenAmount) => tokenAmount !== undefined),
    }),
  )
  .query(async (opts): Promise<QuoteData> => {
    return await opts.ctx.swapManager.getSwapQuoteExactInput({
      fromAmount: opts.input.fromAmount,
      toToken: opts.input.toToken,
    })
  })
