import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { AddressValue, isAddressValue, isChainId, type ChainId } from '@summerfi/sdk-common'

export const getUserMerklRewards = publicProcedure
  .input(
    z.object({
      address: z.custom<AddressValue>(isAddressValue),
      chainIds: z.array(z.custom<ChainId>(isChainId)).optional(),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.merklRewards.getUserMerklRewards(opts.input)
  })
