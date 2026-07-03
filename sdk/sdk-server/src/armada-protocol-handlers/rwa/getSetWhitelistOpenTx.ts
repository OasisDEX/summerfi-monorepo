import { isAddressValue, isChainId, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

/** @see IRWAManager.getSetWhitelistOpenTx */
export const getSetWhitelistOpenTx = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      fleetAddress: z.custom<AddressValue>(isAddressValue),
      isOpen: z.boolean(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.rwaManager.getSetWhitelistOpenTx(opts.input)
  })
