import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getStakingEarningsEstimationV2 = publicProcedure
  .input(
    z.object({
      stakes: z.array(
        z.object({
          id: z.string(),
          weightedAmount: z.bigint(),
        }),
      ),
      sumrPriceUsd: z.number().optional(),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getStakingEarningsEstimationV2(opts.input)
  })
