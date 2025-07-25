import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getUnstakeTx = publicProcedure
  .input(
    z.object({
      amount: z.bigint(),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getUnstakeTx(opts.input)
  })
