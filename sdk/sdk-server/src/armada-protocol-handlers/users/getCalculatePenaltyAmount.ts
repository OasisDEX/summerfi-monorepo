import { UserStakeV2 } from '@summerfi/armada-protocol-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getCalculatePenaltyAmount = publicProcedure
  .input(
    z.object({
      userStakes: z.array(z.custom<UserStakeV2>()),
      amounts: z.array(z.bigint()),
    }),
  )
  .output(z.array(z.bigint()))
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getCalculatePenaltyAmount(opts.input)
  })
