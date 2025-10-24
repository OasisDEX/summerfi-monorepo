import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isChainId, isAddressValue, type ChainId, type AddressValue } from '@summerfi/sdk-common'

export const setWhitelistedBatch = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      fleetCommanderAddress: z.custom<AddressValue>(isAddressValue),
      accounts: z.array(z.custom<AddressValue>(isAddressValue)),
      allowed: z.array(z.boolean()),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.accessControl.setWhitelistedBatch(opts.input)
  })
