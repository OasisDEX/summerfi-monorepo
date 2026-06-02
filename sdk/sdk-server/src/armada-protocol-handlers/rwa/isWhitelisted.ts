import { isAddressValue, isChainId, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const isWhitelisted = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      fleetAddress: z.custom<AddressValue>(isAddressValue),
      accountAddress: z.custom<AddressValue>(isAddressValue),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.rwaManager.isWhitelisted(opts.input)
  })
