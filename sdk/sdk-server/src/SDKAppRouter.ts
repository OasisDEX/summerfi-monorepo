import { getPosition } from './handlers/getPosition'
import { getPool } from './handlers/getPool'
import { getRefinanceSimulation } from './handlers/getRefinanceSimulation'
import { buildOrder } from './handlers/buildOrder'
import { getToken } from './handlers/getToken'
import { getSwapDataExactInput } from './handlers/getSwapData'
import { getSwapQuoteExactInput } from './handlers/getSwapQuote'
import { router } from './TRPC'
import { getImportSimulation } from './handlers/getImportSimulation'

/**
 * Server
 */
export const sdkAppRouter = router({
  getPosition: getPosition,
  getPool: getPool,
  getToken: getToken,
  simulation: { refinance: getRefinanceSimulation, import: getImportSimulation },
  orders: {
    buildOrder: buildOrder,
  },
  swaps: {
    getSwapDataExactInput: getSwapDataExactInput,
    getSwapQuoteExactInput: getSwapQuoteExactInput,
  },
})

export type SDKAppRouter = typeof sdkAppRouter
