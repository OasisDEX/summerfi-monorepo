import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import { getMockPosition } from '@summerfi/sdk-common/mocks'
import type { Position, PositionId, Wallet } from '@summerfi/sdk-common/common'
import type { Chain } from '@summerfi/sdk-common/client'

type PositionParams = Parameters<typeof getMockPosition>[0]

export const getPosition = publicProcedure
  .input(
    z.object({
      id: z.custom<PositionId>((id) => id !== undefined),
      chain: z.custom<Chain>((chain) => chain !== undefined),
      wallet: z.custom<Wallet>((wallet) => wallet !== undefined),
    }),
  )
  .query(async (opts): Promise<Position | undefined> => {
    const params: PositionParams = opts.input
    const position = await getMockPosition(params)
    return position as Position
  })
