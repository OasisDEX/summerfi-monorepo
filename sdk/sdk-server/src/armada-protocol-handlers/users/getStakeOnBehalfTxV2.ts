import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isAddress, isUser, type IAddress, type IUser } from '@summerfi/sdk-common'

export const getStakeOnBehalfTxV2 = publicProcedure
  .input(
    z.object({
      user: z.custom<IUser>(isUser),
      receiver: z.custom<IAddress>(isAddress),
      amount: z.bigint(),
      lockupPeriod: z.bigint(),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getStakeOnBehalfTxV2(opts.input)
  })
