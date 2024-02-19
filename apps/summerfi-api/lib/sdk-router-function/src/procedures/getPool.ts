import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import { mockPool } from '@summerfi/sdk-common/mocks'
import type { Wallet } from '@summerfi/sdk-common/common'
import type { PoolParameters, Protocol } from '@summerfi/sdk-common/protocols'

type PoolParams = Parameters<typeof mockPool>[0]

export const getPool = publicProcedure
  .input(
    z.object({
      protocol: z.custom<Protocol>((id) => id !== undefined),
      poolParameters: z.custom<PoolParameters>((chain) => chain !== undefined),
      protocolParameters: z.custom<Wallet>((wallet) => wallet !== undefined).optional(),
    }),
  )
  .query(async (opts) => {
    // get position from chain / graph
    const params: PoolParams = opts.input
    return await mockPool(params)
  })
