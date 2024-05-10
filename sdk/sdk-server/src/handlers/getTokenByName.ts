import { publicProcedure } from '../TRPC'
import { ChainInfo, ChainInfoSchema, Maybe, Token } from '@summerfi/sdk-common'
import { z } from 'zod'

export const getTokenByName = publicProcedure
  .input(
    z.object({
      chainInfo: ChainInfoSchema,
      name: z.string(),
    }),
  )
  .query(async (opts): Promise<Maybe<Token>> => {
    return opts.ctx.tokensManager.getTokenByName({
      chainInfo: ChainInfo.createFrom(opts.input.chainInfo),
      name: opts.input.name,
    })
  })
