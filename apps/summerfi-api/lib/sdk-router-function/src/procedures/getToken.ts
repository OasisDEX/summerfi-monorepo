import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import { getMockTokenBySymbol } from '@summerfi/sdk/mocks'
import { TokenSymbol } from '@summerfi/sdk/tokens'
import type { ChainInfo } from '@summerfi/sdk/chains'

export const getToken = publicProcedure
  .input(
    z.object({
      chainInfo: z.custom<ChainInfo>((chainInfo) => chainInfo !== undefined),
      symbol: z.nativeEnum(TokenSymbol),
    }),
  )
  .query(async (opts) => {
    return getMockTokenBySymbol(opts.input)
  })
