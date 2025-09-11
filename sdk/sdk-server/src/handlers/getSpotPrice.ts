import { z } from 'zod'
import { isToken, Token } from '@summerfi/sdk-common'
import { publicProcedure } from '../SDKTRPC'

export const getSpotPrice = publicProcedure
  .input(
    z.object({
      baseToken: z.custom<Token>(isToken),
      denomination: z.custom<Token>(isToken).optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.oracleManager.getSpotPrice(opts.input)
  })
