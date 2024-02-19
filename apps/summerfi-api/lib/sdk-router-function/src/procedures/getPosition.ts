import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import { getMockPosition } from '@summerfi/sdk-common/mocks'
import type { Chain } from '@summerfi/sdk-common/chains'
import type { PositionId } from '@summerfi/sdk-common/users'
import type { Wallet } from '@summerfi/sdk-common/common'

type PositionParams = Parameters<typeof getMockPosition>[0]

export const getPosition = publicProcedure
  .input(
    z.object({
      id: z.custom<PositionId>((id) => id !== undefined),
      chain: z.custom<Chain>((chain) => chain !== undefined),
      wallet: z.custom<Wallet>((wallet) => wallet !== undefined),
    }),
  )
  .query(async (opts) => {
    const params: PositionParams = opts.input
    return await getMockPosition(params)
  })
