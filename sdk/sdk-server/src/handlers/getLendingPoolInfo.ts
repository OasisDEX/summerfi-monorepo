import { publicProcedure } from '../TRPC'
import { PoolIdDataSchema } from '@summerfi/sdk-common/protocols'
import { z } from 'zod'

export const getLendingPoolInfo = publicProcedure
  .input(z.object({ poolId: PoolIdDataSchema.passthrough() }))
  .query(async (opts) => {
    return await opts.ctx.protocolManager.getLendingPoolInfo(opts.input.poolId)
  })
