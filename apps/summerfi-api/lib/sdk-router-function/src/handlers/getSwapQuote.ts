import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import { ChainInfo, Token, TokenAmount } from '@summerfi/sdk-common/common'
import { QuoteData } from '@summerfi/swap-common/types'

export const getSwapQuoteExactInput = publicProcedure
  .input(
    z.object({
      chainInfo: z.custom<ChainInfo>((chainInfo) => chainInfo !== undefined),
      fromAmount: z.custom<TokenAmount>((tokenAmount) => tokenAmount !== undefined),
      toToken: z.custom<Token>((token) => token !== undefined),
    }),
  )
  .query(async (opts): Promise<QuoteData> => {
    return await opts.ctx.swapService.getSwapQuoteExactInput({
      chainInfo: opts.input.chainInfo,
      fromAmount: opts.input.fromAmount,
      toToken: opts.input.toToken,
    })
  })
