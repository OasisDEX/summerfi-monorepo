import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isAddress, type IAddress } from '@summerfi/sdk-common'

export const isAuthorizedStakingRewardsCallerV2 = publicProcedure
  .input(
    z.object({
      owner: z.custom<IAddress>(isAddress),
      authorizedCaller: z.custom<IAddress>(isAddress),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.claims.isAuthorizedStakingRewardsCallerV2(opts.input)
  })
