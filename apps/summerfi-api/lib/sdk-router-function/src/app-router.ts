import { router } from '~src/trpc'
import { getPosition } from './handlers/getPosition'
import { getPool } from '~src/handlers/getPool'
import { getRefinanceSimulation } from '~src/handlers/getRefinanceSimulation'
import { ordersHandler } from '~src/handlers/ordersHandler'
import { getToken } from '~src/handlers/getToken'
import { swapsHandler } from './handlers/swapsHandler'

/**
 * Server
 */

export const appRouter = router({
  getPosition: getPosition,
  getPool: getPool,
  simulation: { refinance: getRefinanceSimulation },
  orders: ordersHandler,
  getToken: getToken,
  swaps: swapsHandler,
})

export type AppRouter = typeof appRouter
