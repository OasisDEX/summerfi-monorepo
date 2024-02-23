import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import { getMockPosition } from '@summerfi/sdk-common/mocks'
import type { ChainInfo } from '@summerfi/sdk-common/chains'
import type { IPositionId, IPosition } from '@summerfi/sdk-common/client'
import type { Wallet } from '@summerfi/sdk-common/common'

type PositionParams = Parameters<typeof getMockPosition>[0]

export const getPosition = publicProcedure
  .input(
    z.object({
      id: z.custom<IPositionId>((id) => id !== undefined),
      chain: z.custom<ChainInfo>((chainInfo) => chainInfo !== undefined),
      wallet: z.custom<Wallet>((wallet) => wallet !== undefined),
    }),
  )
  .query(async (opts): Promise<IPosition | undefined> => {
    const params: PositionParams = opts.input
    const position = await getMockPosition(params)
    return position
  })
