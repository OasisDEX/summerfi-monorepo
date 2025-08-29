import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'
import { isChainId, type ChainId } from '@summerfi/sdk-common'

export const intentSwapsCancelOrder = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      orderId: z.string(),
      signingResult: z.custom<{
        signature: string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        signingScheme: any
      }>((val) => val && typeof val === 'object' && 'signature' in val && 'signingScheme' in val),
    }),
  )
  .mutation(async (opts): Promise<{ result: string }> => {
    return opts.ctx.intentSwapsManager.cancelOrder(opts.input)
  })
