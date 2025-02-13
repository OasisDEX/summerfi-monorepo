import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isUser, type IUser } from '@summerfi/sdk-common'

export const getStakeTx = publicProcedure
  .input(
    z.object({
      user: z.custom<IUser>(isUser),
      amount: z.bigint(),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getStakeTx(opts.input)
  })
