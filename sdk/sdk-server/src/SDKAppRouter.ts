import { router } from './SDKTRPC'

import { addArk } from './armada-protocol-handlers/admin/addArk'
import { arks } from './armada-protocol-handlers/admin/arks'
import { arkConfig } from './armada-protocol-handlers/admin/arkConfig'
import { addArks } from './armada-protocol-handlers/admin/addArks'
import { emergencyShutdown } from './armada-protocol-handlers/admin/emergencyShutdown'
import { forceRebalance } from './armada-protocol-handlers/admin/forceRebalance'
import { removeArk } from './armada-protocol-handlers/admin/removeArk'
import { setArkDepositCap } from './armada-protocol-handlers/admin/setArkDepositCap'
import { setArkMaxRebalanceInflow } from './armada-protocol-handlers/admin/setArkMaxRebalanceInflow'
import { setArkMaxRebalanceOutflow } from './armada-protocol-handlers/admin/setArkMaxRebalanceOutflow'
import { setFleetDepositCap } from './armada-protocol-handlers/admin/setFleetDepositCap'
import { setMinimumBufferBalance } from './armada-protocol-handlers/admin/setMinimumBufferBalance'
import { setTipJar } from './armada-protocol-handlers/admin/setTipJar'
import { setTipRate } from './armada-protocol-handlers/admin/setTipRate'
import { updateRebalanceCooldown } from './armada-protocol-handlers/admin/updateRebalanceCooldown'
import { adjustBuffer } from './armada-protocol-handlers/admin/adjustBuffer'
import { rebalance } from './armada-protocol-handlers/admin/rebalance'
import { getDepositTx } from './armada-protocol-handlers/users/getDepositTxTx'
import { getVaultsRaw } from './armada-protocol-handlers/users/getVaults'
import { getVaultsHistoricalRates } from './armada-protocol-handlers/users/getVaultsHistoricalRates'
import { getVaultRaw } from './armada-protocol-handlers/users/getVault'
import { getVaultInfo } from './armada-protocol-handlers/users/getVaultInfo'
import { getPosition as getArmadaPosition } from './armada-protocol-handlers/users/getPosition'
import { getUserPositions } from './armada-protocol-handlers/users/getUserPositions'
import { getUserPosition } from './armada-protocol-handlers/users/getUserPosition'
import { getWithdrawTx } from './armada-protocol-handlers/users/getWithdrawTxTx'
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
import { getGlobalRebalancesRaw } from './armada-protocol-handlers/users/getGlobalRebalancesRaw'
import { getUsersActivityRaw } from './armada-protocol-handlers/users/getUsersActivityRaw'
import { getUserActivityRaw } from './armada-protocol-handlers/users/getUserActivityRaw'
import { getFleetBalance } from './armada-protocol-handlers/users/getFleetBalance'
import { getStakedBalance } from './armada-protocol-handlers/users/getStakedBalance'
import { getTotalBalance } from './armada-protocol-handlers/users/getTotalBalance'
import { getAggregatedRewards } from './armada-protocol-handlers/users/getAggregatedRewards'
import { getAggregatedRewardsIncludingMerkl } from './armada-protocol-handlers/users/getAggregatedRewardsIncludingMerkl'
import { getAggregatedClaimsForChainTx } from './armada-protocol-handlers/users/getAggregatedClaimsForChainTX'
import { getUserDelegatee } from './armada-protocol-handlers/users/getUserDelegatee'
import { getDelegateTx } from './armada-protocol-handlers/users/getDelegateTx'
import { getErc20TokenTransferTx } from './armada-protocol-handlers/users/getErc20TokenTransferTx'
import { getUndelegateTx } from './armada-protocol-handlers/users/getUndelegateTx'
import { getUserVotes } from './armada-protocol-handlers/users/getUserVotes'
import { getUserStakedBalance } from './armada-protocol-handlers/users/getUserStakedBalance'
import { getStakeTx } from './armada-protocol-handlers/users/getStakeTx'
import { getUnstakeTx } from './armada-protocol-handlers/users/getUnstakeTx'
import { getUnstakeFleetTokensTx } from './armada-protocol-handlers/users/getUnstakeFleetTokensTx'
import { getUserEarnedRewards } from './armada-protocol-handlers/users/getUserEarnedRewards'
import { getUserBalance } from './armada-protocol-handlers/users/getUserBalance'
import { getSummerToken } from './armada-protocol-handlers/users/getSummerToken'
import { getDelegationChainLength } from './armada-protocol-handlers/users/getDelegationChainLength'
import { pingHandler } from './handlers/pingHandler'
import { getClaimableAggregatedRewards } from './armada-protocol-handlers/users/getClaimableAggregatedRewards'
import { getMigratablePositions } from './armada-protocol-handlers/users/getMigratablePositions'
import { getMigrationTX } from './armada-protocol-handlers/users/getMigrationTX'
import { getBridgeTx } from './armada-protocol-handlers/users/getBridgeTx'
import { getMigratablePositionsApy } from './armada-protocol-handlers/users/getMigratablePositionsApy'
import { getSpotPrice } from './handlers/getSpotPrice'
import { getSpotPrices } from './handlers/getSpotPrices'
import { intentSwapsGetSellOrderQuote } from './handlers/intentSwapsGetSellOrderQuote'
import { intentSwapsSendOrder } from './handlers/intentSwapsSendOrder'
import { intentSwapsCancelOrder } from './handlers/intentSwapsCancelOrder'
import { intentSwapsCheckOrder } from './handlers/intentSwapsCheckOrder'
import { getVaultSwitchTx } from './armada-protocol-handlers/users/getVaultSwitchTx'
import { getVaultInfoList } from './armada-protocol-handlers/users/getVaultInfoList'
import { getUserMerklRewards } from './armada-protocol-handlers/users/getUserMerklRewards'
import { getUserMerklClaimTx } from './armada-protocol-handlers/users/getUserMerklClaimTx'
import { getReferralFeesMerklClaimTx } from './armada-protocol-handlers/users/getReferralFeesMerklClaimTx'
import { getAuthorizeAsMerklRewardsOperatorTx } from './armada-protocol-handlers/users/getAuthorizeAsMerklRewardsOperatorTx'
import { getIsAuthorizedAsMerklRewardsOperator } from './armada-protocol-handlers/users/getIsAuthorizedAsMerklRewardsOperator'
import { hasGlobalRole } from './armada-protocol-handlers/access-control/hasGlobalRole'
import { hasContractSpecificRole } from './armada-protocol-handlers/access-control/hasContractSpecificRole'
import { grantGlobalRole } from './armada-protocol-handlers/access-control/grantGlobalRole'
import { revokeGlobalRole } from './armada-protocol-handlers/access-control/revokeGlobalRole'
import { grantContractSpecificRole } from './armada-protocol-handlers/access-control/grantContractSpecificRole'
import { revokeContractSpecificRole } from './armada-protocol-handlers/access-control/revokeContractSpecificRole'
import { getAllAddressesWithGlobalRole } from './armada-protocol-handlers/access-control/getAllAddressesWithGlobalRole'
import { getAllAddressesWithContractSpecificRole } from './armada-protocol-handlers/access-control/getAllAddressesWithContractSpecificRole'
import { isWhitelisted } from './armada-protocol-handlers/access-control/isWhitelisted'
import { setWhitelisted } from './armada-protocol-handlers/access-control/setWhitelisted'
import { setWhitelistedBatch } from './armada-protocol-handlers/access-control/setWhitelistedBatch'
import { getAllRoles } from './armada-protocol-handlers/access-control/getAllRoles'

/**
 * Server
 */
export const sdkAppRouter = router({
  debug: {
    ping: pingHandler,
  },
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
  intentSwaps: {
    getSellOrderQuote: intentSwapsGetSellOrderQuote,
    sendOrder: intentSwapsSendOrder,
    cancelOrder: intentSwapsCancelOrder,
    checkOrder: intentSwapsCheckOrder,
  },
  swaps: {
    getSwapDataExactInput: getSwapDataExactInput,
    getSwapQuoteExactInput: getSwapQuoteExactInput,
  },
  oracle: {
    getSpotPrice: getSpotPrice,
    getSpotPrices: getSpotPrices,
  },
  armada: {
    users: {
      getVaultsRaw: getVaultsRaw,
      getVaultRaw: getVaultRaw,
      getGlobalRebalancesRaw: getGlobalRebalancesRaw,
      getUsersActivityRaw: getUsersActivityRaw,
      getUserActivityRaw: getUserActivityRaw,
      getVaultInfo: getVaultInfo,
      getVaultInfoList: getVaultInfoList,
      getVaultsHistoricalRates: getVaultsHistoricalRates,
      getPosition: getArmadaPosition,
      getUserPositions: getUserPositions,
      getUserPosition: getUserPosition,
      getDepositTx: getDepositTx,
      getWithdrawTx: getWithdrawTx,
      getFleetBalance: getFleetBalance,
      getStakedBalance: getStakedBalance,
      getTotalBalance: getTotalBalance,
      getBridgeTx: getBridgeTx,
      getAggregatedRewards: getAggregatedRewards,
      getAggregatedRewardsIncludingMerkl: getAggregatedRewardsIncludingMerkl,
      getClaimableAggregatedRewards: getClaimableAggregatedRewards,
      getAggregatedClaimsForChainTx: getAggregatedClaimsForChainTx,
      getUserDelegatee: getUserDelegatee,
      getDelegateTx: getDelegateTx,
      getErc20TokenTransferTx: getErc20TokenTransferTx,
      getUndelegateTx: getUndelegateTx,
      getUserVotes: getUserVotes,
      getUserStakedBalance: getUserStakedBalance,
      getUserEarnedRewards: getUserEarnedRewards,
      getStakeTx: getStakeTx,
      getUnstakeTx: getUnstakeTx,
      getUnstakeFleetTokensTx: getUnstakeFleetTokensTx,
      getUserBalance: getUserBalance,
      getSummerToken: getSummerToken,
      getDelegationChainLength: getDelegationChainLength,
      getMigratablePositions: getMigratablePositions,
      getMigratablePositionsApy: getMigratablePositionsApy,
      getMigrationTx: getMigrationTX,
      getVaultSwitchTx: getVaultSwitchTx,
      getUserMerklRewards: getUserMerklRewards,
      getUserMerklClaimTx: getUserMerklClaimTx,
      getReferralFeesMerklClaimTx: getReferralFeesMerklClaimTx,
      getAuthorizeAsMerklRewardsOperatorTx: getAuthorizeAsMerklRewardsOperatorTx,
      getIsAuthorizedAsMerklRewardsOperator: getIsAuthorizedAsMerklRewardsOperator,
    },
    admin: {
      rebalance: rebalance,
      adjustBuffer: adjustBuffer,
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
      arks: arks,
      arkConfig: arkConfig,
    },
    accessControl: {
      hasGlobalRole: hasGlobalRole,
      hasContractSpecificRole: hasContractSpecificRole,
      grantGlobalRole: grantGlobalRole,
      revokeGlobalRole: revokeGlobalRole,
      grantContractSpecificRole: grantContractSpecificRole,
      revokeContractSpecificRole: revokeContractSpecificRole,
      getAllAddressesWithGlobalRole: getAllAddressesWithGlobalRole,
      getAllAddressesWithContractSpecificRole: getAllAddressesWithContractSpecificRole,
      isWhitelisted: isWhitelisted,
      setWhitelisted: setWhitelisted,
      setWhitelistedBatch: setWhitelistedBatch,
      getAllRoles: getAllRoles,
    },
  },
})

export type SDKAppRouter = typeof sdkAppRouter
