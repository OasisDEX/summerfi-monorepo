import { LendingPoolIdDataSchema } from '@summerfi/sdk-common/protocols'
import { publicProcedure } from '../TRPC'
import { z } from 'zod'

export const getLendingPoolInfo = publicProcedure
  .input(
    z.object({
      poolId: LendingPoolIdDataSchema.catchall(z.any()),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.protocolManager.getLendingPoolInfo(opts.input.poolId)
  })
