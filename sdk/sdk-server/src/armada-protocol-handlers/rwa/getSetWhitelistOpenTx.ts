import { isAddressValue, isChainId, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getSetWhitelistOpenTx = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      fleetAddress: z.custom<AddressValue>(isAddressValue),
      isOpen: z.boolean(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.rwa.getSetWhitelistOpenTx(opts.input)
  })
