import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import {
  isPositionId,
  isProtocolEnum,
  Position,
  Protocol,
  type PositionId,
  type ProtocolEnum,
} from './sdk-mocks'

/**
 * Server
 */

const t = initTRPC.create()
export const router = t.router
export const publicProcedure = t.procedure

export const appRouter = router({
  getUser: t.procedure.input(z.string()).query((opts) => {
    opts.input // string
    return { id: opts.input, name: 'Bilbo' }
  }),
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
