import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { AddressValue, isAddressValue, ChainIdSchema } from '@summerfi/sdk-common'

export const getUserMerklClaimTx = publicProcedure
  .input(
    z.object({
      address: z.custom<AddressValue>(isAddressValue),
      chainId: ChainIdSchema,
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.merklRewards.getUserMerklClaimTx(opts.input)
  })
