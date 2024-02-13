import { z } from 'zod'
import {
  isPositionId,
  isProtocolEnum,
  Position,
  Protocol,
  type PositionId,
  type ProtocolEnum,
} from './sdk-mocks'
import { publicProcedure, tRouter } from '~src/trpc'

/**
 * Server
 */

export const appRouter = tRouter({
  getPosition: publicProcedure
    .input(z.object({ positionId: z.custom<PositionId>(isPositionId) }))
    .query(async (opts) => {
      const { positionId } = opts.input

      // get position from chain / graph
      const position = new Position({ positionId })

      return position
    }),
  getProtocol: publicProcedure
    .input(z.object({ protocolEnum: z.custom<ProtocolEnum>(isProtocolEnum) }))
    .query(async (opts) => {
      const { protocolEnum } = opts.input

      // get position from chain / graph
      const protocol = new Protocol({ protocolEnum })

      return protocol
    }),
})

export type AppRouter = typeof appRouter
