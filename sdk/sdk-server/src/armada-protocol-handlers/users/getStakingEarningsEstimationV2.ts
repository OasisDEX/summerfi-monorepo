import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isAddressValue, type AddressValue } from '@summerfi/sdk-common'

export const getStakingEarningsEstimationV2 = publicProcedure
  .input(
    z.object({
      stakes: z.array(
        z.object({
          amount: z.bigint(),
          period: z.bigint(),
          weightedAmount: z.bigint(),
        }),
      ),
      sumrPriceUsd: z.number().optional(),
      userAddress: z.custom<AddressValue>(isAddressValue),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getStakingEarningsEstimationV2(opts.input)
  })
