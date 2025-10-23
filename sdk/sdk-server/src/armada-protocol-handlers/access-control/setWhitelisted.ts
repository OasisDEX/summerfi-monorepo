import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isChainId, isAddressValue, type ChainId, type AddressValue } from '@summerfi/sdk-common'

export const setWhitelisted = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      account: z.custom<AddressValue>(isAddressValue),
      allowed: z.boolean(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.accessControl.setWhitelisted(opts.input)
  })
