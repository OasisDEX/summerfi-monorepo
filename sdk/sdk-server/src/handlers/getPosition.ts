import { z } from 'zod'
import type { ChainInfo, Position, PositionId, Wallet } from '@summerfi/sdk-common/common'
import { publicProcedure } from '../TRPC'

export const getPosition = publicProcedure
  .input(
    z.object({
      id: z.custom<PositionId>((id) => id !== undefined),
      chain: z.custom<ChainInfo>((chainInfo) => chainInfo !== undefined),
      wallet: z.custom<Wallet>((wallet) => wallet !== undefined),
    }),
  )
  .query(async (): Promise<Position | undefined> => {
    throw new Error('Not implemented')
  })
