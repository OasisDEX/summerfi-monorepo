import { publicProcedure } from '../SDKTRPC'
import { IToken, isChainInfo } from '@summerfi/sdk-common'
import { z } from 'zod'

export const getTokenBySymbol = publicProcedure
  .input(
    z.object({
      chainInfo: z.any(),
      symbol: z.string(),
    }),
  )
  .query(async (opts): Promise<IToken> => {
    if (!isChainInfo(opts.input.chainInfo)) {
      throw new Error('Invalid chain info')
    }

    return opts.ctx.tokensManager.getTokenBySymbol({
      chainInfo: opts.input.chainInfo,
      symbol: opts.input.symbol,
    })
  })
