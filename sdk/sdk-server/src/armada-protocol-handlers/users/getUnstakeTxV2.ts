import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isUser, type IUser } from '@summerfi/sdk-common'

export const getUnstakeTxV2 = publicProcedure
  .input(
    z.object({
      user: z.custom<IUser>(isUser),
      userStakeIndex: z.bigint(),
      amount: z.bigint(),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getUnstakeTxV2(opts.input)
  })
