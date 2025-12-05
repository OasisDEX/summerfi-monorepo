import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getStakingStakesV2 = publicProcedure
  .input(
    z.object({
      first: z.number().int().min(1).max(1000).optional(),
      skip: z.number().int().min(0).optional(),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getStakingStakesV2(opts.input)
  })
