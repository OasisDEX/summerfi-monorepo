import { z } from 'zod'
import { isDenomination, isToken, Token, type Denomination } from '@summerfi/sdk-common'
import { publicProcedure } from '../SDKTRPC'

export const getSpotPrice = publicProcedure
  .input(
    z.object({
      baseToken: z.custom<Token>(isToken),
      denomination: z.custom<Denomination>(isDenomination).optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.oracleManager.getSpotPrice(opts.input)
  })
