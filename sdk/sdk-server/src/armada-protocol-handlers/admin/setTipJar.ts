import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { AddressValue, type ChainId, isAddressValue, isChainId } from '@summerfi/sdk-common'

export const setTipJar = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      addressValue: z.custom<AddressValue>(isAddressValue),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.admin.setTipJar(opts.input)
  })
