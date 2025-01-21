import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { TRPCError } from '@trpc/server'

export const getStakeTx = publicProcedure
  .input(
    z.object({
      amount: z.bigint(),
    }),
  )
  .query(async (opts) => {
    try {
      return await opts.ctx.armadaManager.governance.getStakeTx(opts.input)
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to call getStakeTx',
        cause: error,
      })
    }
  })
