import { router } from './TRPC'
import { deposit } from './earn-protocol-handlers/deposit'
import { withdraw } from './earn-protocol-handlers/withdraw'

/**
 * Server
 */
export const earnProtocolAppRouter = router({
  deposit: deposit,
  withdraw: withdraw,
})

export type EarnProtocolAppRouter = typeof earnProtocolAppRouter
