import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import type { Position, PositionId, Wallet } from '@summerfi/sdk-common/common'
import type { Chain } from '@summerfi/sdk-client'

export const getPosition = publicProcedure
  .input(
    z.object({
      id: z.custom<PositionId>((id) => id !== undefined),
      chain: z.custom<Chain>((chain) => chain !== undefined),
      wallet: z.custom<Wallet>((wallet) => wallet !== undefined),
    }),
  )
  .query(async (): Promise<Position | undefined> => {
    throw new Error('Not implemented')
  })
