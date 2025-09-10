import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'
import { isChainId, type ChainId } from '@summerfi/sdk-common'
import type { EcdsaSigningScheme } from '@cowprotocol/cow-sdk'

export const intentSwapsCancelOrder = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      orderId: z.string(),
      signingResult: z.custom<{
        signature: string
        signingScheme: EcdsaSigningScheme
      }>((val) => val && typeof val === 'object' && 'signature' in val && 'signingScheme' in val),
    }),
  )
  .mutation(async (opts): Promise<{ result: string }> => {
    return opts.ctx.intentSwapsManager.cancelOrder(opts.input)
  })
