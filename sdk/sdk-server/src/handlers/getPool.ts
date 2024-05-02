import { z } from 'zod'
import { publicProcedure } from '../TRPC'

export const getLendingPool = publicProcedure
  .input(
    z.object({
      poolId: z.unknown(),
    }),
  )
  .query(async (opts) => {
    const poolId = opts.input.poolId
    return await opts.ctx.protocolManager.getLendingPool(poolId)
  })
