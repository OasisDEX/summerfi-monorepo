import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { AddressValue, isAddressValue, type ChainId, isChainId } from '@summerfi/sdk-common'

export const getReferralFeesMerklClaimTx = publicProcedure
  .input(
    z.object({
      address: z.custom<AddressValue>(isAddressValue),
      chainId: z.custom<ChainId>(isChainId),
      rewardsTokensAddresses: z.array(z.custom<AddressValue>(isAddressValue)).optional(),
    }),
  )
  .query(async (opts) => {
    return await opts.ctx.armadaManager.merklRewards.getReferralFeesMerklClaimTx(opts.input)
  })
