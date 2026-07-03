import { isAddressValue, isChainId, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

/** @see IRWAManager.getSetWhitelistedTx */
export const getSetWhitelistedTx = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      fleetAddress: z.custom<AddressValue>(isAddressValue),
      accountAddress: z.custom<AddressValue>(isAddressValue),
      allowed: z.boolean(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.rwaManager.getSetWhitelistedTx(opts.input)
  })
