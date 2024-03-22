import { z } from 'zod'
import { publicProcedure } from '../TRPC'
import { protocolManager } from '@summerfi/protocol-manager'

export const getPool = publicProcedure
  .input(
    z.object({
      poolId: protocolManager.poolIdSchema,
    }),
  )
  .query(async (opts) => {
    const poolId = opts.input.poolId

    return opts.ctx.protocolManager.getPool(poolId)
  })
