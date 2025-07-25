import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { AddressValue, isAddressValue } from '@summerfi/sdk-common'

export const getUserMerklRewards = publicProcedure
  .input(
    z.object({
      address: z.custom<AddressValue>(isAddressValue),
      chainIds: z.array(z.number()).optional(),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.merklRewards.getUserMerklRewards(opts.input)
  })
