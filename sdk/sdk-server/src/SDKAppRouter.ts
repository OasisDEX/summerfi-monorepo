import { router } from './SDKTRPC'

import { addArk } from './armada-protocol-handlers/governance/addArk'
import { addArks } from './armada-protocol-handlers/governance/addArks'
import { emergencyShutdown } from './armada-protocol-handlers/governance/emergencyShutdown'
import { forceRebalance } from './armada-protocol-handlers/governance/forceRebalance'
import { removeArk } from './armada-protocol-handlers/governance/removeArk'
import { setArkDepositCap } from './armada-protocol-handlers/governance/setArkDepositCap'
import { setArkMaxRebalanceInflow } from './armada-protocol-handlers/governance/setArkMaxRebalanceInflow'
import { setArkMaxRebalanceOutflow } from './armada-protocol-handlers/governance/setArkMaxRebalanceOutflow'
import { setFleetDepositCap } from './armada-protocol-handlers/governance/setFleetDepositCap'
import { setMinimumBufferBalance } from './armada-protocol-handlers/governance/setMinimumBufferBalance'
import { setTipJar } from './armada-protocol-handlers/governance/setTipJar'
import { setTipRate } from './armada-protocol-handlers/governance/setTipRate'
import { updateRebalanceCooldown } from './armada-protocol-handlers/governance/updateRebalanceCooldown'
import { adjustBuffer } from './armada-protocol-handlers/keepers/adjustBuffer'
import { rebalance } from './armada-protocol-handlers/keepers/rebalance'
import { getDepositTX } from './armada-protocol-handlers/users/getDepositTX'
import { getVaultsRaw } from './armada-protocol-handlers/users/getVaults'
import { getVaultRaw } from './armada-protocol-handlers/users/getVault'
import { getPoolInfo } from './armada-protocol-handlers/users/getPoolInfo'
import { getPosition as getArmadaPosition } from './armada-protocol-handlers/users/getPosition'
import { getUpdateDepositTX } from './armada-protocol-handlers/users/getUpdateDepositTX'
import { getUserPositions } from './armada-protocol-handlers/users/getUserPositions'
import { getUserPosition } from './armada-protocol-handlers/users/getUserPosition'
import { getWithdrawTX } from './armada-protocol-handlers/users/getWithdrawTX'
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
    users: {
      getVaultsRaw: getVaultsRaw,
      getVaultRaw: getVaultRaw,
      getPoolInfo: getPoolInfo,
      getPosition: getArmadaPosition,
      getUserPositions: getUserPositions,
      getUserPosition: getUserPosition,
      getDepositTX: getDepositTX,
      getUpdateDepositTX: getUpdateDepositTX,
      getWithdrawTX: getWithdrawTX,
    },
    keepers: {
      rebalance: rebalance,
      adjustBuffer: adjustBuffer,
    },
    governance: {
      setFleetDepositCap: setFleetDepositCap,
      setTipJar: setTipJar,
      setTipRate: setTipRate,
      addArk: addArk,
      addArks: addArks,
      removeArk: removeArk,
      setArkDepositCap: setArkDepositCap,
      setArkMaxRebalanceInflow: setArkMaxRebalanceInflow,
      setArkMaxRebalanceOutflow: setArkMaxRebalanceOutflow,
      setMinimumBufferBalance: setMinimumBufferBalance,
      forceRebalance: forceRebalance,
      updateRebalanceCooldown: updateRebalanceCooldown,
      emergencyShutdown: emergencyShutdown,
    },
  },
})

export type SDKAppRouter = typeof sdkAppRouter
