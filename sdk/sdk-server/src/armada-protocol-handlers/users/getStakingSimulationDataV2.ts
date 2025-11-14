import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isAddressValue, type AddressValue } from '@summerfi/sdk-common'

export const getStakingSimulationDataV2 = publicProcedure
  .input(
    z.object({
      amount: z.bigint(),
      period: z.bigint(),
      sumrPriceUsd: z.number(),
      userAddress: z.custom<AddressValue>(isAddressValue),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.governance.getStakingSimulationDataV2(opts.input)
  })
