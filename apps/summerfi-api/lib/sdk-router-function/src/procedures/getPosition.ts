import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import { getMockPositionSerialized } from '@summerfi/sdk-common/mocks'
import type { ChainInfo } from '@summerfi/sdk-common/chains'
import type { PositionId, PositionSerialized } from '@summerfi/sdk-common/users'
import type { Wallet } from '@summerfi/sdk-common/common'

type PositionParams = Parameters<typeof getMockPositionSerialized>[0]

export const getPosition = publicProcedure
  .input(
    z.object({
      id: z.custom<PositionId>((id) => id !== undefined),
      chainInfo: z.custom<ChainInfo>((chainInfo) => chainInfo !== undefined),
      wallet: z.custom<Wallet>((wallet) => wallet !== undefined),
    }),
  )
  .query(async (opts): Promise<PositionSerialized | undefined> => {
    const params: PositionParams = opts.input
    const position = await getMockPositionSerialized(params)
    return position
  })
