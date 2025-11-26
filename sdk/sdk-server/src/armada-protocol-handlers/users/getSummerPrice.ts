import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getSummerPrice = publicProcedure
  .input(
    z
      .object({
        override: z.number().optional(),
      })
      .optional(),
  )
  .query(async (opts) => {
    const price = opts.ctx.armadaManager.utils.getSummerPrice(opts.input)
    return { price }
  })
