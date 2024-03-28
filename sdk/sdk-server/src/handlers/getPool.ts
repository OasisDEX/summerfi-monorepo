import { z } from 'zod'
import { publicProcedure } from '../TRPC'

export const getPool = publicProcedure
  .input(
    z.object({
      poolId: z.unknown(),
    }),
  )
  .query(async (opts) => {
    const poolId = opts.input.poolId
    return await opts.ctx.protocolManager.getPool(poolId)
  })
