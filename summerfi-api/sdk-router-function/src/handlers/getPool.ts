import { z } from 'zod'
import { publicProcedure } from '~src/trpc'
import type { PoolParameters, Protocol } from '@summerfi/sdk-common/protocols'
import type { Wallet } from '@summerfi/sdk-common/common'

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
  .query(async () => {
    throw new Error('Not implemented')
  })
