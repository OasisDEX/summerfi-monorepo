import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isUser, type IUser } from '@summerfi/sdk-common'

export const getStakeTxV2 = publicProcedure
  .input(
    z.object({
      user: z.custom<IUser>(isUser),
      amount: z.bigint(),
      lockupPeriod: z.bigint(),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getStakeTxV2(opts.input)
  })
