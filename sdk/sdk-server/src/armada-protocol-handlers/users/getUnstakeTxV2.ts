import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getUnstakeTxV2 = publicProcedure
  .input(
    z.object({
      userStakeIndex: z.bigint(),
      amount: z.bigint(),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getUnstakeTxV2(opts.input)
  })
