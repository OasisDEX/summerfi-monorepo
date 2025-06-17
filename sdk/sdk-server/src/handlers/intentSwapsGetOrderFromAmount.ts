import { z } from 'zod'
import { publicProcedure } from '../SDKTRPC'
import {
  isTokenAmount,
  isToken,
  isAddress,
  type ITokenAmount,
  type IToken,
  type IAddress,
} from '@summerfi/sdk-common'

export const intentSwapsGetOrderFromAmount = publicProcedure
  .input(
    z.object({
      fromAmount: z.custom<ITokenAmount>(isTokenAmount),
      toToken: z.custom<IToken>(isToken),
      from: z.custom<IAddress>(isAddress),
      receiver: z.custom<IAddress>(isAddress).optional(),
      partiallyFillable: z.boolean().optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.intentSwapsManager.getOrderFromAmount(opts.input)
  })
