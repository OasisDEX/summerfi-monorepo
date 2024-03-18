import { z } from 'zod'
import type { IProtocol, PoolParameters, ProtocolParameters } from '@summerfi/sdk-common/protocols'
import { publicProcedure } from '../TRPC'

export const getPool = publicProcedure
  .input(
    z.object({
      protocol: z.custom<IProtocol>((protocol) => protocol !== undefined),
      poolParameters: z.custom<PoolParameters>((poolParameter) => poolParameter !== undefined),
      protocolParameters: z
        .custom<ProtocolParameters>((protocolParameters) => protocolParameters !== undefined)
        .optional(),
    }),
  )
  .query(async () => {
    throw new Error('Not implemented')
  })
