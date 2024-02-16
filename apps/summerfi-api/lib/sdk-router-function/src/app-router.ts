import { router } from '~src/trpc'
import { getProtocol } from './procedures/getProtocol'
import { getPosition } from './procedures/getPosition'

/**
 * Server
 */

export const appRouter = router({
  getPosition: getPosition,
  getProtocol: getProtocol,
})

export type AppRouter = typeof appRouter
