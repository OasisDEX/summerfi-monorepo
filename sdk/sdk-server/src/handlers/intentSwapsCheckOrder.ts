import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'
import { isChainId, type ChainId } from '@summerfi/sdk-common'

export const intentSwapsCheckOrder = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      orderId: z.string(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.intentSwapsManager.checkOrder(opts.input)
  })
