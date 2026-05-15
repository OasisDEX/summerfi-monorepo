import { isAddressValue, isChainId, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getBuyOrders = publicProcedure
  .input(
    z.object({
      userAddress: z.custom<AddressValue>(isAddressValue),
      chainId: z.custom<ChainId>(isChainId).optional(),
      status: z.enum(['active', 'cancelled']).optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.dca.getBuyOrders(opts.input)
  })
