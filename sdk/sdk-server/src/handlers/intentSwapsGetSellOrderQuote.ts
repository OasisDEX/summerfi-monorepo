import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'
import {
  isTokenAmount,
  isToken,
  isAddress,
  type ITokenAmount,
  type IToken,
  type IAddress,
  type IPrice,
  isPrice,
} from '@summerfi/sdk-common'

export const intentSwapsGetSellOrderQuote = publicProcedure
  .input(
    z.object({
      fromAmount: z.custom<ITokenAmount>(isTokenAmount),
      toToken: z.custom<IToken>(isToken),
      sender: z.custom<IAddress>(isAddress),
      receiver: z.custom<IAddress>(isAddress).optional(),
      partiallyFillable: z.boolean().optional(),
      limitPrice: z.custom<IPrice>(isPrice).optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.intentSwapsManager.getSellOrderQuote(opts.input)
  })
