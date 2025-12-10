import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getCalculatePenaltyPercentage = publicProcedure
  .input(
    z.object({
      userStakes: z.array(z.custom<{ lockupEndTime: number }>()),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getCalculatePenaltyPercentage(opts.input)
  })
