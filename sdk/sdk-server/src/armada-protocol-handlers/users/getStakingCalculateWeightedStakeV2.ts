import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getStakingCalculateWeightedStakeV2 = publicProcedure
  .input(
    z.object({
      amount: z.bigint(),
      lockupPeriod: z.bigint(),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getStakingCalculateWeightedStakeV2(opts.input)
  })
