import { router } from './SDKTRPC'
import { deposit } from './earn-protocol-handlers/deposit'
import { withdraw } from './earn-protocol-handlers/withdraw'
import { buildOrder } from './handlers/buildOrder'
import { getEarnProtocolSimulation } from './handlers/getEarnProtocolSimulation'
import { getImportSimulation } from './handlers/getImportSimulation'
import { getLendingPool } from './handlers/getLendingPool'
import { getLendingPoolInfo } from './handlers/getLendingPoolInfo'
import { getPosition } from './handlers/getPosition'
import { getRefinanceSimulation } from './handlers/getRefinanceSimulation'
import { getSwapDataExactInput } from './handlers/getSwapData'
import { getSwapQuoteExactInput } from './handlers/getSwapQuote'
import { getTokenByAddress } from './handlers/getTokenByAddress'
import { getTokenByName } from './handlers/getTokenByName'
import { getTokenBySymbol } from './handlers/getTokenBySymbol'

/**
 * Server
 */
export const sdkAppRouter = router({
  protocols: {
    getPosition: getPosition,
    getLendingPool: getLendingPool,
    getLendingPoolInfo: getLendingPoolInfo,
  },
  tokens: {
    getTokenBySymbol: getTokenBySymbol,
    getTokenByName: getTokenByName,
    getTokenByAddress: getTokenByAddress,
  },
  simulation: {
    refinance: getRefinanceSimulation,
    import: getImportSimulation,
    earn: getEarnProtocolSimulation,
  },
  orders: {
    buildOrder: buildOrder,
  },
  swaps: {
    getSwapDataExactInput: getSwapDataExactInput,
    getSwapQuoteExactInput: getSwapQuoteExactInput,
  },
  earn: {
    deposit: deposit,
    withdraw: withdraw,
  },
})

export type SDKAppRouter = typeof sdkAppRouter
