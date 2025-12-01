import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isAddress, isUser, type IAddress, type IUser } from '@summerfi/sdk-common'

export const getUserStakingEarnedV2 = publicProcedure
  .input(
    z.object({
      user: z.custom<IUser>(isUser),
      rewardTokenAddress: z.custom<IAddress>(isAddress).optional(),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getUserStakingEarnedV2(opts.input)
  })
