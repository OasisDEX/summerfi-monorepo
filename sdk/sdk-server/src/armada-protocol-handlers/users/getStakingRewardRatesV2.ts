import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isAddress, type IAddress } from '@summerfi/sdk-common'

export const getStakingRewardRatesV2 = publicProcedure
  .input(
    z.object({
      rewardTokenAddress: z.custom<IAddress>(isAddress),
      sumrPriceUsd: z.number().optional(),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getStakingRewardRatesV2(opts.input)
  })
