import { publicProcedure } from '../TRPC'
import { PoolIdDataSchema } from '@summerfi/sdk-common/protocols'
import { z } from 'zod'

export const getLendingPool = publicProcedure
  .input(z.object({ poolId: PoolIdDataSchema }))
  .query(async (opts) => {
    return await opts.ctx.protocolManager.getLendingPool(opts.input.poolId)
  })
