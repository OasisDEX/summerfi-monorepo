import { publicProcedure } from '../TRPC'
import { PoolIdSchema } from '@summerfi/sdk-common/protocols'
import { z } from 'zod'

export const getLendingPool = publicProcedure
  .input(z.object({ poolId: PoolIdSchema.passthrough() }))
  .query(async (opts) => {
    return await opts.ctx.protocolManager.getLendingPool(opts.input.poolId)
  })
