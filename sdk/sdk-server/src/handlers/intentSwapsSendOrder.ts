import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'
import {
  isChainId,
  ChainId,
  type IntentQuoteData,
  type ITokenAmount,
  isTokenAmount,
} from '@summerfi/sdk-common'
import type { EcdsaSigningScheme } from '@cowprotocol/cow-sdk'

export const intentSwapsSendOrder = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      fromAmount: z.custom<ITokenAmount>(isTokenAmount),
      order: z.custom<IntentQuoteData['order']>((val) => val && typeof val === 'object'),
      signingResult: z.custom<{
        signature: string
        signingScheme: EcdsaSigningScheme
      }>((val) => val && typeof val === 'object' && 'signature' in val && 'signingScheme' in val),
    }),
  )
  .mutation(async (opts) => {
    return opts.ctx.intentSwapsManager.sendOrder(opts.input)
  })
