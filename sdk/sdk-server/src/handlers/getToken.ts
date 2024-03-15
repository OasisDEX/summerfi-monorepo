import { z } from 'zod'
import { type ChainInfo } from '@summerfi/sdk-common/common'
import { TokenSymbol } from '@summerfi/sdk-common/common/enums'
import { publicProcedure } from '../TRPC'

export const getToken = publicProcedure
  .input(
    z.object({
      chainInfo: z.custom<ChainInfo>((chainInfo) => chainInfo !== undefined),
      symbol: z.nativeEnum(TokenSymbol),
    }),
  )
  .query(async () => {
    throw new Error('Not implemented')
  })
