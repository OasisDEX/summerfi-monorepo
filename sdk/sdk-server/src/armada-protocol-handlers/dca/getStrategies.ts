import { isAddressValue, isChainId, type AddressValue, type ChainId } from '@summerfi/sdk-common'
import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'

export const getStrategies = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      userAddress: z.custom<AddressValue>(isAddressValue).optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.dca.getStrategies(opts.input)
  })
