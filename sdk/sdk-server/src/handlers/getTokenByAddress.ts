import { publicProcedure } from '../TRPC'
import { IToken, Maybe, isAddress, isChainInfo } from '@summerfi/sdk-common'
import { z } from 'zod'

export const getTokenByAddress = publicProcedure
  .input(
    z.object({
      chainInfo: z.any(),
      address: z.any(),
    }),
  )
  .query(async (opts): Promise<Maybe<IToken>> => {
    if (!isChainInfo(opts.input.chainInfo)) {
      throw new Error('Invalid chain info')
    }
    if (!isAddress(opts.input.address)) {
      throw new Error('Invalid address')
    }

    return opts.ctx.tokensManager.getTokenByAddress({
      chainInfo: opts.input.chainInfo,
      address: opts.input.address,
    })
  })
