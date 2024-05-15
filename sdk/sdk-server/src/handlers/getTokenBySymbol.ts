import { publicProcedure } from '../TRPC'
import { ChainInfo, ChainInfoDataSchema, Maybe, Token } from '@summerfi/sdk-common'
import { z } from 'zod'

export const getTokenBySymbol = publicProcedure
  .input(
    z.object({
      chainInfo: ChainInfoDataSchema,
      symbol: z.string(),
    }),
  )
  .query(async (opts): Promise<Maybe<Token>> => {
    return opts.ctx.tokensManager.getTokenBySymbol({
      chainInfo: ChainInfo.createFrom(opts.input.chainInfo),
      symbol: opts.input.symbol,
    })
  })
