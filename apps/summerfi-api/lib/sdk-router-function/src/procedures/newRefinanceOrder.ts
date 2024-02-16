import { z } from 'zod'
import { isProtocolEnum, Protocol, type ProtocolEnum } from '../sdk-mocks'
import { publicProcedure } from '~src/trpc'

export const newRefinanceOrder = publicProcedure
  .input(z.object({ protocolEnum: z.custom<ProtocolEnum>(isProtocolEnum) }))
  .query(async (opts) => {
    const { protocolEnum } = opts.input

    // get position from chain / graph
    const protocol = new Protocol({ protocolEnum })

    return protocol
  })
