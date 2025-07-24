import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isUser, type IUser } from '@summerfi/sdk-common'

export const getUserMerklRewards = publicProcedure
  .input(
    z.object({
      user: z.custom<IUser>(isUser),
      chainIds: z.array(z.number()).optional(),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.merklRewards.getUserMerklRewards(opts.input)
  })
