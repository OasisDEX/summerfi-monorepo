import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { TRPCError } from '@trpc/server'
import { isUser, type IUser } from '@summerfi/sdk-common'

export const getUserBalance = publicProcedure
  .input(
    z.object({
      user: z.custom<IUser>(isUser),
    }),
  )
  .query(async (opts) => {
    try {
      return await opts.ctx.armadaManager.governance.getUserBalance(opts.input)
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to call getUnstakeTx',
        cause: error,
      })
    }
  })
