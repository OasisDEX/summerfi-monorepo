import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isUser, type IUser } from '@summerfi/sdk-common'
import { TRPCError } from '@trpc/server'

export const getDelegateTx = publicProcedure
  .input(
    z.object({
      user: z.custom<IUser>(isUser),
    }),
  )
  .query(async (opts) => {
    try {
      return await opts.ctx.armadaManager.governance.getDelegateTx(opts.input)
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to call getDelegateTx',
        cause: error,
      })
    }
  })
