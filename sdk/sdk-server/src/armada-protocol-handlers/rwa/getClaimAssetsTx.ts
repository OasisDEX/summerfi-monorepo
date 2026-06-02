import { isAddressValue, isChainId, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getClaimAssetsTx = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      fleetAddress: z.custom<AddressValue>(isAddressValue),
      userAddress: z.custom<AddressValue>(isAddressValue),
      roundId: z.bigint(),
      amount: z.string(),
      receiverAddress: z.custom<AddressValue>(isAddressValue).optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.rwaManager.getClaimAssetsTx(opts.input)
  })
