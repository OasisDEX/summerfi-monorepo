import { getPosition } from './handlers/getPosition'
import { getLendingPool } from './handlers/getLendingPool'
import { getRefinanceSimulation } from './handlers/getRefinanceSimulation'
import { buildOrder } from './handlers/buildOrder'
import { getSwapDataExactInput } from './handlers/getSwapData'
import { getSwapQuoteExactInput } from './handlers/getSwapQuote'
import { router } from './TRPC'
import { getImportSimulation } from './handlers/getImportSimulation'
import { getLendingPoolInfo } from './handlers/getLendingPoolInfo'
import { getTokenByName } from './handlers/getTokenByName'
import { getTokenByAddress } from './handlers/getTokenByAddress'
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
  },
  orders: {
    buildOrder: buildOrder,
  },
  swaps: {
    getSwapDataExactInput: getSwapDataExactInput,
    getSwapQuoteExactInput: getSwapQuoteExactInput,
  },
})

export type SDKAppRouter = typeof sdkAppRouter
