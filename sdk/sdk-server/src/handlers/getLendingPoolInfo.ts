import { publicProcedure } from '../TRPC'
import { PoolIdSchema } from '@summerfi/sdk-common/protocols'
import { z } from 'zod'

export const getLendingPoolInfo = publicProcedure
  .input(z.object({ poolId: PoolIdSchema }))
  .query(async (opts) => {
    return await opts.ctx.protocolManager.getLendingPoolInfo(opts.input.poolId)
  })
