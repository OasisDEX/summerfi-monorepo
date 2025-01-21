import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getStakeTx = publicProcedure
  .input(
    z.object({
      amount: z.bigint(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.governance.getStakeTx(opts.input)
  })
