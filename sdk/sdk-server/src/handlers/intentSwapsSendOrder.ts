import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'
import {
  isChainId,
  ChainId,
  type IntentQuoteData,
  type ITokenAmount,
  isTokenAmount,
  type IAddress,
  isAddress,
} from '@summerfi/sdk-common'
import { EcdsaSigningScheme } from '@cowprotocol/cow-sdk'

export const intentSwapsSendOrder = publicProcedure
  .input(
    z.object({
      chainId: z.custom<ChainId>(isChainId),
      fromAmount: z.custom<ITokenAmount>(isTokenAmount),
      sender: z.custom<IAddress>(isAddress),
      order: z.custom<IntentQuoteData['order']>((val) => val && typeof val === 'object'),
      signingResult: z.object({
        signature: z.string().regex(/^0x[0-9a-fA-F]{130}$/),
        signingScheme: z.nativeEnum(EcdsaSigningScheme),
      }),
    }),
  )
  .mutation(async (opts) => {
    return opts.ctx.intentSwapsManager.sendOrder(opts.input)
  })
