import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import { getMockTokenBySymbol } from '@summerfi/sdk-common/mocks'
import { type ChainInfo } from '@summerfi/sdk-common/common'
import { TokenSymbol } from '@summerfi/sdk-common/common/enums'

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
