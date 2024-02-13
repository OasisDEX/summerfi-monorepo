import { Context } from '~src/context'
import { initTRPC } from '@trpc/server'

export const t = initTRPC.create<Context>()

export const tRouter = t.router
export const publicProcedure = t.procedure
export const createCallerFactory = t.createCallerFactory
