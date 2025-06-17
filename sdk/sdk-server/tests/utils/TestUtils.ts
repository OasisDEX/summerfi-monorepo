/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { sdkAppRouter } from 'src/sdkAppRouter.1'
import { SDKAppContext, SDKContextOptions } from '../../src/context/SDKContext'
import { createCallerFactory } from '../../src/SDKTRPC'

// context for each request
export const createTestContext = (opts: SDKContextOptions): SDKAppContext => {
  return {
    deployments: {} as any,
    orderPlannerService: {} as any,
    swapManager: {} as any,
    configProvider: {} as any,
    protocolsRegistry: {} as any,
    protocolManager: {} as any,
  }
}

const ctx = createTestContext({} as any)
const createCaller = createCallerFactory(sdkAppRouter)

export const testAppRouter = createCaller(ctx)
