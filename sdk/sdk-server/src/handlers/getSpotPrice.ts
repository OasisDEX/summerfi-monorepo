import { z } from 'zod'
import { isToken, Token } from '@summerfi/sdk-common/common'
import { publicProcedure } from '../SDKTRPC'

export const getSpotPrice = publicProcedure
  .input(
    z.object({
      baseToken: z.custom<Token>(isToken),
      quoteToken: z.custom<Token>(isToken).optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.oracleManager.getSpotPrice(opts.input)
  })
