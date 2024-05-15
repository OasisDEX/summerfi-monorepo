import { publicProcedure } from '../TRPC'
import { Maybe, Token, isChainInfo } from '@summerfi/sdk-common'
import { z } from 'zod'

export const getTokenByName = publicProcedure
  .input(
    z.object({
      chainInfo: z.any(),
      name: z.string(),
    }),
  )
  .query(async (opts): Promise<Maybe<Token>> => {
    if (!isChainInfo(opts.input.chainInfo)) {
      throw new Error('Invalid chain info')
    }

    return opts.ctx.tokensManager.getTokenByName({
      chainInfo: opts.input.chainInfo,
      name: opts.input.name,
    })
  })
