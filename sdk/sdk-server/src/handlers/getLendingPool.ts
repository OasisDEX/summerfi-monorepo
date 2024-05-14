import { publicProcedure } from '../TRPC'
import { LendingPoolIdSchema } from '@summerfi/sdk-common/protocols'
import { z } from 'zod'

export const getLendingPool = publicProcedure
  .input(
    z.object({
      poolId: LendingPoolIdSchema.catchall(z.any()),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.protocolManager.getLendingPool(opts.input.poolId)
  })
