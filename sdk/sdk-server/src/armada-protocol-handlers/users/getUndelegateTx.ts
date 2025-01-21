import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { TRPCError } from '@trpc/server'

export const getUndelegateTx = publicProcedure.input(z.undefined()).query(async (opts) => {
  try {
    return opts.ctx.armadaManager.governance.getUndelegateTx()
  } catch (error) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to get undelegate transaction',
      cause: error,
    })
  }
})
