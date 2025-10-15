import { z } from 'zod'
import { publicProcedure } from '../../SDKTRPC'
import { AddressValue, type ChainId, isAddressValue, isChainId } from '@summerfi/sdk-common'

export const arkConfig = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      arkAddressValue: z.custom<AddressValue>(isAddressValue),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.armadaManager.admin.arkConfig(opts.input)
  })
