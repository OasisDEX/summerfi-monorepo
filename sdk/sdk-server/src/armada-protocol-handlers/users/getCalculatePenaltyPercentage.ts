import { UserStakeV2 } from '@summerfi/armada-protocol-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getCalculatePenaltyPercentage = publicProcedure
  .input(
    z.object({
      userStakes: z.array(z.custom<UserStakeV2>()),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getCalculatePenaltyPercentage(opts.input)
  })
