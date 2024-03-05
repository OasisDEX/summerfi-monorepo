import { router } from '~src/trpc'
import { getPosition } from './handlers/getPosition'
import { getPool } from './handlers/getPool'
import { getRefinanceSimulation } from './handlers/getRefinanceSimulation'
import { buildOrder } from './handlers/buildOrder'
import { getToken } from './handlers/getToken'
import { getSwapDataExactInput } from './handlers/getSwapData'
import { getSwapQuoteExactInput } from './handlers/getSwapQuote'

/**
 * Server
 */
export const appRouter = router({
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

export type AppRouter = typeof appRouter
