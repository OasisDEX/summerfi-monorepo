import { publicProcedure } from '../TRPC'
import { IToken, Maybe, isChainInfo } from '@summerfi/sdk-common'
import { z } from 'zod'

export const getTokenBySymbol = publicProcedure
  .input(
    z.object({
      chainInfo: z.any(),
      symbol: z.string(),
    }),
  )
  .query(async (opts): Promise<Maybe<IToken>> => {
    if (!isChainInfo(opts.input.chainInfo)) {
      throw new Error('Invalid chain info')
    }

    return opts.ctx.tokensManager.getTokenBySymbol({
      chainInfo: opts.input.chainInfo,
      symbol: opts.input.symbol,
    })
  })
