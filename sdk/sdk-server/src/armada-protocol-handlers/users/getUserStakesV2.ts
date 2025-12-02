import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isUser, type IUser } from '@summerfi/sdk-common'

export const getUserStakesV2 = publicProcedure
  .input(
    z.object({
      user: z.custom<IUser>(isUser),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getUserStakesV2(opts.input)
  })
