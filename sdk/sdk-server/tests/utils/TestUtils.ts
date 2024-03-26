/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { sdkAppRouter } from '../../src/SDKAppRouter'
import { SDKAppContext, ContextOptions } from '../../src/context/Context'
import { createCallerFactory } from '../../src/TRPC'

// context for each request
export const createTestContext = (opts: ContextOptions): SDKAppContext => {
  return {
    deployments: {} as any,
    orderPlannerService: {} as any,
    swapManager: {} as any,
    configProvider: {} as any,
    protocolsRegistry: {} as any,
  }
}

const ctx = createTestContext({} as any)
const createCaller = createCallerFactory(sdkAppRouter)

export const testAppRouter = createCaller(ctx)
