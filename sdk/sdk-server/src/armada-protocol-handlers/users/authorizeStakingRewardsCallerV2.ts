import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isAddress, isUser, type IAddress, type IUser } from '@summerfi/sdk-common'

export const authorizeStakingRewardsCallerV2 = publicProcedure
  .input(
    z.object({
      user: z.custom<IUser>(isUser),
      authorizedCaller: z.custom<IAddress>(isAddress),
      isAuthorized: z.boolean(),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.claims.authorizeStakingRewardsCallerV2(opts.input)
  })
