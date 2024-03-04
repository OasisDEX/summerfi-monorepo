/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { appRouter } from './app-router'

import type { Context, ContextOptions } from '~src/context'
import { createCallerFactory } from '~src/trpc'

// context for each request
export const createTestContext = (opts: ContextOptions): Context => {
  return {
    provider: undefined,
    deployments: {} as any,
    orderPlannerService: {} as any,
    swapService: {} as any,
  }
}

const ctx = createTestContext({} as any)
const createCaller = createCallerFactory(appRouter)

export const testAppRouter = createCaller(ctx)
