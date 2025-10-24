import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isChainId, isAddressValue, type ChainId, type AddressValue } from '@summerfi/sdk-common'

export const setWhitelistedBatchAQ = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      accounts: z.array(z.custom<AddressValue>(isAddressValue)),
      allowed: z.array(z.boolean()),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.accessControl.setWhitelistedBatchAQ(opts.input)
  })
