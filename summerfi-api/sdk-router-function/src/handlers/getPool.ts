import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import { mockPool } from '@summerfi/sdk-common/mocks'
import type { PoolParameters, Protocol } from '@summerfi/sdk-common/protocols'
import type { Wallet } from '@summerfi/sdk-common/common'

type PoolParams = Parameters<typeof mockPool>[0]

export const getPool = publicProcedure
  .input(
    z.object({
      protocol: z.custom<Protocol>((protocol) => protocol !== undefined),
      poolParameters: z.custom<PoolParameters>((poolParameter) => poolParameter !== undefined),
      protocolParameters: z
        .custom<Wallet>((protocolParameters) => protocolParameters !== undefined)
        .optional(),
    }),
  )
  .query(async (opts) => {
    // get position from poolParameter / graph
    const params: PoolParams = opts.input
    return await mockPool(params)
  })
