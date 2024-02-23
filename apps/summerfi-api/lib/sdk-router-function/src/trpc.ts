import { initTRPC } from '@trpc/server'
import type { Context } from '~src/context'

export const t = initTRPC.context<Context>().create()

export const router = t.router
export const createCallerFactory = t.createCallerFactory

export const publicProcedure = t.procedure
