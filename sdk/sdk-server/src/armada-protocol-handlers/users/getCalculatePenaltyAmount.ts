import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getCalculatePenaltyAmount = publicProcedure
  .input(
    z.object({
      userStakes: z.array(z.custom<{ lockupEndTime: number }>()),
      amounts: z.array(z.bigint()),
    }),
  )
  .output(z.array(z.bigint()))
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getCalculatePenaltyAmount(opts.input)
  })
