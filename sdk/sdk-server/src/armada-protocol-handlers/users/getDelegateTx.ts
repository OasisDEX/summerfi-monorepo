import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isUser, type IUser } from '@summerfi/sdk-common'

export const getDelegateTx = publicProcedure
  .input(
    z.object({
      user: z.custom<IUser>(isUser),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getDelegateTx(opts.input)
  })
