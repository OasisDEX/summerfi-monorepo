/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { appRouter } from '~src/app-router'

import type { Context, ContextOptions } from '~src/context'
import { createCallerFactory } from '~src/trpc'

// context for each request
export const createTestContext = (opts: ContextOptions): Context => {
  return {}
}

const ctx = createTestContext({} as any)
const createCaller = createCallerFactory(appRouter)

export const testAppRouter = createCaller(ctx)
