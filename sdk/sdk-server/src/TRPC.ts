import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { SDKAppContext } from './Context'

export const t = initTRPC.context<SDKAppContext>().create({ transformer: superjson })

export const router = t.router

export const createCallerFactory = t.createCallerFactory

export const publicProcedure = t.procedure
