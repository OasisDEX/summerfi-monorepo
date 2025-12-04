import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getStakingStakesV2 = publicProcedure
  .input(
    z.object({
      first: z.number().optional(),
      skip: z.number().optional(),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getStakingStakesV2(opts.input)
  })
