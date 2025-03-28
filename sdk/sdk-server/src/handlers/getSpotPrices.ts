import { z } from 'zod'
import {
  IChainInfo,
  isChainInfo,
  isFiatCurrency,
  isToken,
  type FiatCurrency,
  type IToken,
} from '@summerfi/sdk-common/common'
import { publicProcedure } from '../SDKTRPC'

export const getSpotPrices = publicProcedure
  .input(
    z.object({
      chainInfo: z.custom<IChainInfo>(isChainInfo),
      baseTokens: z.custom<IToken>(isToken).array(),
      quoteCurrency: z.custom<FiatCurrency>(isFiatCurrency).optional(),
    }),
  )
  .query(async (opts) => {
    return opts.ctx.oracleManager.getSpotPrices(opts.input)
  })
