import { router } from './SDKTRPC'
import { getNewDepositTX } from './armada-protocol-handlers/getNewDepositTX'
import { getPool } from './armada-protocol-handlers/getPool'
import { getPoolInfo } from './armada-protocol-handlers/getPoolInfo'
import { getPosition as getArmadaPosition } from './armada-protocol-handlers/getPosition'
import { getUpdateDepositTX } from './armada-protocol-handlers/getUpdateDepositTX'
import { getWithdrawTX } from './armada-protocol-handlers/getWithdrawTX'
import { buildOrder } from './handlers/buildOrder'
import { getArmadaSimulation } from './handlers/getArmadaSimulation'
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
    armada: getArmadaSimulation,
  },
  orders: {
    buildOrder: buildOrder,
  },
  swaps: {
    getSwapDataExactInput: getSwapDataExactInput,
    getSwapQuoteExactInput: getSwapQuoteExactInput,
  },
  armada: {
    getPool: getPool,
    getPoolInfo: getPoolInfo,
    getPosition: getArmadaPosition,
    getNewDepositTX: getNewDepositTX,
    getUpdateDepositTX: getUpdateDepositTX,
    getWithdrawTX: getWithdrawTX,
  },
})

export type SDKAppRouter = typeof sdkAppRouter
