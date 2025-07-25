import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isUser, type IUser } from '@summerfi/sdk-common'

export const getUserDelegatee = publicProcedure
  .input(
    z.object({
      user: z.custom<IUser>(isUser),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getUserDelegatee(opts.input)
  })
