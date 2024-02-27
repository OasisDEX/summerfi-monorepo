import { router } from '~src/trpc'
import { getPosition } from './handlers/getPosition'
import { getPool } from '~src/handlers/getPool'
import { getRefinanceSimulation } from '~src/handlers/getRefinanceSimulation'
import { getOrder } from '~src/handlers/getOrder'
import { getToken } from '~src/handlers/getToken'
import { getSwap } from './handlers/getSwap'

/**
 * Server
 */

export const appRouter = router({
  getPosition: getPosition,
  getPool: getPool,
  simulation: { refinance: getRefinanceSimulation },
  orders: getOrder,
  getToken: getToken,
  swaps: getSwap,
})

export type AppRouter = typeof appRouter
