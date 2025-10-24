import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { isChainId, isAddressValue, type ChainId, type AddressValue } from '@summerfi/sdk-common'

export const isWhitelisted = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      fleetCommanderAddress: z.custom<AddressValue>(isAddressValue),
      account: z.custom<AddressValue>(isAddressValue),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.accessControl.isWhitelisted(opts.input)
  })
