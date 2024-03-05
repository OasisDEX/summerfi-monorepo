import { router } from '~src/trpc'
import { getPosition } from './handlers/getPosition'
import { getPool } from './handlers/getPool'
import { getRefinanceSimulation } from './handlers/getRefinanceSimulation'
import { buildOrder } from './handlers/buildOrder'
import { getToken } from './handlers/getToken'
import { getSwapData } from './handlers/getSwapData'
import { getSwapQuote } from './handlers/getSwapQuote'

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
    getSwapData: getSwapData,
    getSwapQuote: getSwapQuote,
  },
})

export type AppRouter = typeof appRouter
