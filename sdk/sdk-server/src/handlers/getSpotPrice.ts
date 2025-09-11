import { z } from 'zod'
import { isToken, Token, FiatCurrency, isFiatCurrency } from '@summerfi/sdk-common'
import { publicProcedure } from '../SDKTRPC'

export const getSpotPrice = publicProcedure
  .input(
    z.object({
      baseToken: z.custom<Token>(isToken),
      denomination: z.union([z.custom<Token>(isToken), z.custom<FiatCurrency>(isFiatCurrency)]).optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.oracleManager.getSpotPrice(opts.input)
  })
