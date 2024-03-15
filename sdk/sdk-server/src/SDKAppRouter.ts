import { getPosition } from './handlers/getPosition'
import { getPool } from './handlers/getPool'
import { getRefinanceSimulation } from './handlers/getRefinanceSimulation'
import { buildOrder } from './handlers/buildOrder'
import { getToken } from './handlers/getToken'
import { getSwapDataExactInput } from './handlers/getSwapData'
import { getSwapQuoteExactInput } from './handlers/getSwapQuote'
import { router } from './TRPC'

/**
 * Server
 */
export const SDKAppRouter = router({
  getPosition: getPosition,
  getPool: getPool,
  getToken: getToken,
  simulation: { refinance: getRefinanceSimulation },
  orders: {
    buildOrder: buildOrder,
  },
  swaps: {
    getSwapDataExactInput: getSwapDataExactInput,
    getSwapQuoteExactInput: getSwapQuoteExactInput,
  },
})

export type AppRouter = typeof SDKAppRouter
