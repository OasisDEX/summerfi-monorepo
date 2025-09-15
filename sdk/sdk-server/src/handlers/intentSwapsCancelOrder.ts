import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'
import { isChainId, type ChainId } from '@summerfi/sdk-common'
import { EcdsaSigningScheme } from '@cowprotocol/cow-sdk'

export const intentSwapsCancelOrder = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      orderId: z.string(),
      signingResult: z.object({
        signature: z.string().regex(/^0x[0-9a-fA-F]{130}$/),
        signingScheme: z.nativeEnum(EcdsaSigningScheme),
      }),
    }),
  )
  .mutation(async (opts): Promise<{ result: string }> => {
    return opts.ctx.intentSwapsManager.cancelOrder(opts.input)
  })
