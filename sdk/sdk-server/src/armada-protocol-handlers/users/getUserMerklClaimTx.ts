import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { AddressValue, isAddressValue, type ChainId, isChainId } from '@summerfi/sdk-common'

export const getUserMerklClaimTx = publicProcedure
  .input(
    z.object({
      address: z.custom<AddressValue>(isAddressValue),
      chainId: z.custom<ChainId>(isChainId),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.merklRewards.getUserMerklClaimTx(opts.input)
  })
