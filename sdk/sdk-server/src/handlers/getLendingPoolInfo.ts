import { LendingPoolIdSchema } from '@summerfi/sdk-common'
import { publicProcedure } from '../TRPC'
import { z } from 'zod'

export const getLendingPoolInfo = publicProcedure
  .input(
    z.object({
      poolId: LendingPoolIdSchema.catchall(z.any()),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.protocolManager.getLendingPoolInfo(opts.input.poolId)
  })
