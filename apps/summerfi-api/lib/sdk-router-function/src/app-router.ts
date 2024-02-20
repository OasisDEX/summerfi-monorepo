import { router } from '~src/trpc'
import { getPosition } from './procedures/getPosition'
import { getPool } from '~src/procedures/getPool'
import { getSimulation } from '~src/procedures/getSimulation'
import { getOrder } from '~src/procedures/getOrder'
import { getToken } from '~src/procedures/getToken'

/**
 * Server
 */

export const appRouter = router({
  getPosition: getPosition,
  getPool: getPool,
  getSimulation: getSimulation,
  getOrder: getOrder,
  getToken: getToken,
})

export type AppRouter = typeof appRouter
