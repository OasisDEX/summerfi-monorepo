import { z } from 'zod'
import { publicProcedure } from '../TRPC'
import {
  protocolManager,
} from '@summerfi/protocol-manager'

export const getPool = publicProcedure
  .input(
    z.object({
      poolId: protocolManager.poolIdSchema,
    }),
  )
  .query(async (params) => {
    const poolId = params.input.poolId

    return protocolManager.getPool(poolId)
  })
