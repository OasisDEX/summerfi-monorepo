import { router } from '~src/trpc'
import { getPosition } from './procedures/getPosition'
import { getPool } from '~src/procedures/getPool'
import { getSimulation } from '~src/procedures/getSimulation'
import { getOrder } from '~src/procedures/getOrder'

/**
 * Server
 */

export const appRouter = router({
  getPosition: getPosition,
  getPool: getPool,
  getSimulation: getSimulation,
  getOrder: getOrder,
})

export type AppRouter = typeof appRouter
