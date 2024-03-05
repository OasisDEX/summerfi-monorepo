import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import { ChainInfo, Token, TokenAmount, Address, Percentage } from '@summerfi/sdk-common/common'
import { QuoteData } from '@summerfi/swap-common/types'

export const getSwapQuote = publicProcedure
  .input(
    z.object({
      chainInfo: z.custom<ChainInfo>((chainInfo) => chainInfo !== undefined),
      fromAmount: z.custom<TokenAmount>((tokenAmount) => tokenAmount !== undefined),
      toToken: z.custom<Token>((token) => token !== undefined),
      recipient: z.custom<Address>((recipient) => recipient !== undefined),
      slippage: z.custom<Percentage>((slippage) => slippage !== undefined),
    }),
  )
  .query(async (opts): Promise<QuoteData> => {
    return await opts.ctx.swapService.getSwapQuote({
      chainInfo: opts.input.chainInfo,
      fromAmount: opts.input.fromAmount,
      toToken: opts.input.toToken,
    })
  })
