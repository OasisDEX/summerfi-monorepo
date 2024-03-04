import { initTRPC } from '@trpc/server'
import type { Context } from '~src/context'
import superjson from 'superjson'

export const t = initTRPC.context<Context>().create({ transformer: superjson })

export const router = t.router
export const createCallerFactory = t.createCallerFactory

export const publicProcedure = t.procedure
