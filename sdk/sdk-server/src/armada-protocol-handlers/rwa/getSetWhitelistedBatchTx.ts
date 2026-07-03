import { isAddressValue, isChainId, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

/** @see IRWAManager.getSetWhitelistedBatchTx */
export const getSetWhitelistedBatchTx = publicProcedure
  .input(
    z
      .object({
        chainId: z.custom<ChainId>(isChainId),
        fleetAddress: z.custom<AddressValue>(isAddressValue),
        accountAddresses: z.array(z.custom<AddressValue>(isAddressValue)),
        allowed: z.array(z.boolean()),
      })
      .refine((params) => params.accountAddresses.length === params.allowed.length, {
        message: 'accountAddresses and allowed must have the same length',
      }),
  )
  .query(async (opts) => {
    return opts.ctx.rwaManager.getSetWhitelistedBatchTx(opts.input)
  })
