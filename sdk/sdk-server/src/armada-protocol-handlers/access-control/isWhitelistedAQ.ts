import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isChainId, isAddressValue, type ChainId, type AddressValue } from '@summerfi/sdk-common'

export const isWhitelistedAQ = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      targetAddress: z.custom<AddressValue>(isAddressValue),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.accessControl.isWhitelistedAQ(opts.input)
  })
