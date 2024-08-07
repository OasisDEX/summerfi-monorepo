import { z } from 'zod'
import { Token, TokenAmount } from '@summerfi/sdk-common/common'
import { QuoteData } from '@summerfi/sdk-common/swap'
import { publicProcedure } from '../SDKTRPC'
import { Percentage } from '@summerfi/sdk-common'

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
