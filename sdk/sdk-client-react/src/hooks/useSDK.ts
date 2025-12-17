import { makeAdminSDK, makeSDK } from '@summerfi/sdk-client'
import { useCallback, useMemo } from 'react'
import { getDepositTXHandler } from '../handlers/getDepositTXHandler'
import { getTokenBySymbolHandler } from '../handlers/getTokenBySymbolHandler'
import { getUserPositionsHandler } from '../handlers/getUserPositionsHandler'
import { getUserPositionHandler } from '../handlers/getUserPositionHandler'
import { getWithdrawTXHandler } from '../handlers/getWithdrawTXHandler'
import { getCrossChainDepositTxHandler } from '../handlers/getCrossChainDepositTxHandler'
import { getCrossChainWithdrawTxHandler } from '../handlers/getCrossChainWithdrawTxHandler'

import { useSDKContext } from '../components/SDKContext'
import { getChainHandler } from '../handlers/getChainHandler'
import { getWalletAddressHandler } from '../factories/getWalletAddressHandler'
import { getCurrentUserHandler } from '../handlers/getCurrentUserHandler'
import { getChainInfoHandler } from '../handlers/getChainInfoHandler'
import { getSwapQuoteHandler } from '../handlers/getSwapQuoteHandler'
import { getAggregatedRewardsHandler } from '../handlers/getAggregatedRewardsHandler'
import { getAggregatedRewardsIncludingMerklHandler } from '../handlers/getAggregatedRewardsIncludingMerklHandler'
import { getAggregatedClaimsForChainTXHandler } from '../handlers/getAggregatedClaimsForChainTXHandler'
import { getDelegateTxHandler } from '../handlers/getDelegateTxHandler'
import { getDelegateTxV2Handler } from '../handlers/getDelegateTxV2Handler'
import { getStakeTxHandler } from '../handlers/getStakeTxHandler'
import { getStakeTxV2Handler } from '../handlers/getStakeTxV2Handler'
import { getStakeOnBehalfTxV2Handler } from '../handlers/getStakeOnBehalfTxV2Handler'
import { getUndelegateTxHandler } from '../handlers/getUndelegateTxHandler'
import { getUnstakeTxHandler } from '../handlers/getUnstakeTxHandler'
import { getUnstakeTxV2Handler } from '../handlers/getUnstakeTxV2Handler'
import { getUserStakesCountHandler } from '../handlers/getUserStakesCountHandler'
import { getUserStakesV2Handler } from '../handlers/getUserStakesV2Handler'
import { getStakingStakesV2Handler } from '../handlers/getStakingStakesV2Handler'
import { getUserStakingBalanceV2Handler } from '../handlers/getUserStakingBalanceV2Handler'
import { getUserStakingWeightedBalanceV2Handler } from '../handlers/getUserStakingWeightedBalanceV2Handler'
import { getUserBlendedYieldBoostHandler } from '../handlers/getUserBlendedYieldBoostHandler'
import { getUserStakingEarnedV2Handler } from '../handlers/getUserStakingEarnedV2Handler'
import { getUserStakingSumrStakedHandler } from '../handlers/getUserStakingSumrStakedHandler'
import { getCalculatePenaltyPercentageHandler } from '../handlers/getCalculatePenaltyPercentageHandler'
import { getCalculatePenaltyAmountHandler } from '../handlers/getCalculatePenaltyAmountHandler'
import { getStakingRewardRatesV2Handler } from '../handlers/getStakingRewardRatesV2Handler'
import { getStakingBucketsInfoV2Handler } from '../handlers/getStakingBucketsInfoV2Handler'
import { getStakingCalculateWeightedStakeV2Handler } from '../handlers/getStakingCalculateWeightedStakeV2Handler'
import { getStakingTotalWeightedSupplyV2Handler } from '../handlers/getStakingTotalWeightedSupplyV2Handler'
import { getStakingTotalSumrStakedV2Handler } from '../handlers/getStakingTotalSumrStakedV2Handler'
import { getStakingRevenueShareV2Handler } from '../handlers/getStakingRevenueShareV2Handler'
import { getStakingSimulationDataV2Handler } from '../handlers/getStakingSimulationDataV2Handler'
import { getStakingEarningsEstimationV2Handler } from '../handlers/getStakingEarningsEstimationV2Handler'
import { getStakingConfigV2Handler } from '../handlers/getStakingConfigV2Handler'
import { getStakingStatsV2Handler } from '../handlers/getStakingStatsV2Handler'
import { getProtocolRevenueHandler } from '../handlers/getProtocolRevenueHandler'
import { getProtocolTvlHandler } from '../handlers/getProtocolTvlHandler'
import { getUserDelegateeHandler } from '../handlers/getUserDelegateeHandler'
import { getUserDelegateeV2Handler } from '../handlers/getUserDelegateeV2Handler'
import { getUserStakedBalanceHandler } from '../handlers/getUserStakedBalanceHandler'
import { getUserVotesHandler } from '../handlers/getUserVotesHandler'
import { getSummerTokenHandler } from '../handlers/getSummerTokenHandler'
import { getBridgeTxHandler } from '../handlers/getBridgeTxHandler'
import { getMigrateTxHandler } from '../handlers/getMigrateTxHandler'
import { getVaultSwitchTXHandler } from '../handlers/getVaultSwitchTxHandler'
import { getMigratablePositionsHandler } from '../handlers/getMigratablePositionsHandler'
import { getMigratablePositionsHandlerApy } from '../handlers/getMigratablePositionsHandlerApy'
import { getSpotPriceHandler } from '../handlers/getSpotPriceHandler'
import { getSpotPricesHandler } from '../handlers/getSpotPricesHandler'
import { getAuthorizeAsMerklRewardsOperatorTxHandler } from '../handlers/getAuthorizeAsMerklRewardsOperatorTxHandler'
import { getReferralFeesMerklClaimTxHandler } from '../handlers/getReferralFeesMerklClaimTxHandler'
import { getUserMerklRewardsHandler } from '../handlers/getUserMerklRewardsHandler'
import { getPositionHistoryHandler } from '../handlers/getPositionHistoryHandler'
import { getDepositsHandler } from '../handlers/getDepositsHandler'
import { getWithdrawalsHandler } from '../handlers/getWithdrawalsHandler'
import { getTipRateHandler } from '../handlers/getTipRateHandler'
import { getStakedBalanceHandler } from '../handlers/getStakedBalanceHandler'
import { getUnstakeFleetTokensTxHandler } from '../handlers/getUnstakeFleetTokensTxHandler'
import { getUserBalanceHandler } from '../handlers/getUserBalanceHandler'
import { getSummerPriceHandler } from '../handlers/getSummerPriceHandler'
import { isWhitelistedHandler } from '../handlers/isWhitelistedHandler'
import { setWhitelistedTxHandler } from '../handlers/setWhitelistedTxHandler'
import { setWhitelistedBatchTxHandler } from '../handlers/setWhitelistedBatchTxHandler'
import { isWhitelistedAQHandler } from '../handlers/isWhitelistedAQHandler'
import { setWhitelistedAQTxHandler } from '../handlers/setWhitelistedAQTxHandler'
import { setWhitelistedBatchAQTxHandler } from '../handlers/setWhitelistedBatchAQTxHandler'
import { grantContractSpecificRoleHandler } from '../handlers/grantContractSpecificRole'
import { revokeContractSpecificRoleHandler } from '../handlers/revokeContractSpecificRole'
import { getAllRolesHandler } from '../handlers/getAllRolesHandler'
import { setFleetDepositCapHandler } from '../handlers/setFleetDepositCapHandler'
import { setMinimumBufferBalanceHandler } from '../handlers/setMinimumBufferBalanceHandler'
import { setArkDepositCapHandler } from '../handlers/setArkDepositCapHandler'

type UseSdk = {
  walletAddress?: string
  chainId?: number
  clientId?: string
}

export const useSDK = (params: UseSdk) => {
  const { apiURL } = useSDKContext()
  const sdk = useMemo(() => {
    if (params.clientId) {
      return makeAdminSDK({ apiURL, clientId: params.clientId })
    }
    return makeSDK({ apiURL })
  }, [apiURL, params.clientId])

  const { chainId, walletAddress: walletAddressString } = params

  const getChainInfo = useMemo(() => getChainInfoHandler(chainId), [chainId])
  const getTargetChainInfo = useCallback((specificChainId: number) => {
    const chainInfoFn = getChainInfoHandler(specificChainId)
    return chainInfoFn()
  }, [])

  const getWalletAddress = useMemo(
    () => getWalletAddressHandler(walletAddressString),
    [walletAddressString],
  )

  // State getters
  const getCurrentUser = useMemo(
    () => getCurrentUserHandler(getChainInfo, getWalletAddress),
    [getCurrentUserHandler, getChainInfo, getWalletAddress],
  )

  // CHAIN HANDLERS
  const getChain = useMemo(() => getChainHandler(sdk), [sdk, chainId])
  const getTokenBySymbol = useMemo(() => getTokenBySymbolHandler(getChain), [getChain])

  // ARMADA HANDLERS
  const getWithdrawTx = useMemo(() => getWithdrawTXHandler(sdk), [sdk])
  const getDepositTx = useMemo(() => getDepositTXHandler(sdk), [sdk])
  const getCrossChainDepositTx = useMemo(() => getCrossChainDepositTxHandler(sdk), [sdk])
  const getCrossChainWithdrawTx = useMemo(() => getCrossChainWithdrawTxHandler(sdk), [sdk])
  const getUserPosition = useMemo(() => getUserPositionHandler(sdk), [sdk])
  const getUserPositions = useMemo(() => getUserPositionsHandler(sdk), [sdk])

  // SWAPS
  const getSwapQuote = useMemo(() => getSwapQuoteHandler(sdk), [sdk])

  // ORACLES

  const getSpotPrice = useMemo(() => getSpotPriceHandler(sdk), [sdk])
  const getSpotPrices = useMemo(() => getSpotPricesHandler(sdk), [sdk])

  // CLAIMS
  const getAggregatedRewards = useMemo(() => getAggregatedRewardsHandler(sdk), [sdk])
  const getAggregatedRewardsIncludingMerkl = useMemo(
    () => getAggregatedRewardsIncludingMerklHandler(sdk),
    [sdk],
  )
  const getAggregatedClaimsForChainTx = useMemo(
    () => getAggregatedClaimsForChainTXHandler(sdk),
    [sdk],
  )

  const getBridgeTx = useMemo(() => getBridgeTxHandler(sdk), [sdk])
  const getDelegateTx = useMemo(() => getDelegateTxHandler(sdk), [sdk])
  const getDelegateTxV2 = useMemo(() => getDelegateTxV2Handler(sdk), [sdk])
  const getStakeTx = useMemo(() => getStakeTxHandler(sdk), [sdk])
  const getStakeTxV2 = useMemo(() => getStakeTxV2Handler(sdk), [sdk])
  const getStakeOnBehalfTxV2 = useMemo(() => getStakeOnBehalfTxV2Handler(sdk), [sdk])
  const getUndelegateTx = useMemo(() => getUndelegateTxHandler(sdk), [sdk])
  const getUnstakeTx = useMemo(() => getUnstakeTxHandler(sdk), [sdk])
  const getUnstakeTxV2 = useMemo(() => getUnstakeTxV2Handler(sdk), [sdk])
  const getUserStakesCount = useMemo(() => getUserStakesCountHandler(sdk), [sdk])
  const getUserStakesV2 = useMemo(() => getUserStakesV2Handler(sdk), [sdk])
  const getStakingStakesV2 = useMemo(() => getStakingStakesV2Handler(sdk), [sdk])
  const getCalculatePenaltyPercentage = useMemo(
    () => getCalculatePenaltyPercentageHandler(sdk),
    [sdk],
  )
  const getCalculatePenaltyAmount = useMemo(() => getCalculatePenaltyAmountHandler(sdk), [sdk])
  const getUserStakingBalanceV2 = useMemo(() => getUserStakingBalanceV2Handler(sdk), [sdk])
  const getUserStakingWeightedBalanceV2 = useMemo(
    () => getUserStakingWeightedBalanceV2Handler(sdk),
    [sdk],
  )
  const getUserBlendedYieldBoost = useMemo(() => getUserBlendedYieldBoostHandler(sdk), [sdk])
  const getUserStakingEarnedV2 = useMemo(() => getUserStakingEarnedV2Handler(sdk), [sdk])
  const getUserStakingSumrStaked = useMemo(() => getUserStakingSumrStakedHandler(sdk), [sdk])
  const getStakingRewardRatesV2 = useMemo(() => getStakingRewardRatesV2Handler(sdk), [sdk])
  const getStakingBucketsInfoV2 = useMemo(() => getStakingBucketsInfoV2Handler(sdk), [sdk])
  const getStakingCalculateWeightedStakeV2 = useMemo(
    () => getStakingCalculateWeightedStakeV2Handler(sdk),
    [sdk],
  )
  const getStakingTotalWeightedSupplyV2 = useMemo(
    () => getStakingTotalWeightedSupplyV2Handler(sdk),
    [sdk],
  )
  const getStakingTotalSumrStakedV2 = useMemo(() => getStakingTotalSumrStakedV2Handler(sdk), [sdk])
  const getStakingRevenueShareV2 = useMemo(() => getStakingRevenueShareV2Handler(sdk), [sdk])
  const getStakingSimulationDataV2 = useMemo(() => getStakingSimulationDataV2Handler(sdk), [sdk])
  const getStakingEarningsEstimationV2 = useMemo(
    () => getStakingEarningsEstimationV2Handler(sdk),
    [sdk],
  )
  const getStakingConfigV2 = useMemo(() => getStakingConfigV2Handler(sdk), [sdk])
  const getStakingStatsV2 = useMemo(() => getStakingStatsV2Handler(sdk), [sdk])
  const getProtocolRevenue = useMemo(() => getProtocolRevenueHandler(sdk), [sdk])
  const getProtocolTvl = useMemo(() => getProtocolTvlHandler(sdk), [sdk])
  const getUserDelegatee = useMemo(() => getUserDelegateeHandler(sdk), [sdk])
  const getUserDelegateeV2 = useMemo(() => getUserDelegateeV2Handler(sdk), [sdk])
  const getUserStakedBalance = useMemo(() => getUserStakedBalanceHandler(sdk), [sdk])
  const getUserVotes = useMemo(() => getUserVotesHandler(sdk), [sdk])
  const getSummerToken = useMemo(() => getSummerTokenHandler(sdk), [sdk])
  const getMigrateTx = useMemo(() => getMigrateTxHandler(sdk), [sdk])
  const getVaultSwitchTx = useMemo(() => getVaultSwitchTXHandler(sdk), [sdk])
  const getMigratablePositions = useMemo(() => getMigratablePositionsHandler(sdk), [sdk])
  const getMigratablePositionsApy = useMemo(() => getMigratablePositionsHandlerApy(sdk), [sdk])
  const getAuthorizeAsMerklRewardsOperatorTx = useMemo(
    () => getAuthorizeAsMerklRewardsOperatorTxHandler(sdk),
    [sdk],
  )
  const getReferralFeesMerklClaimTx = useMemo(() => getReferralFeesMerklClaimTxHandler(sdk), [sdk])
  const getUserMerklRewards = useMemo(() => getUserMerklRewardsHandler(sdk), [sdk])
  const getPositionHistory = useMemo(() => getPositionHistoryHandler(sdk), [sdk])
  const getDeposits = useMemo(() => getDepositsHandler(sdk), [sdk])
  const getWithdrawals = useMemo(() => getWithdrawalsHandler(sdk), [sdk])
  const getTipRate = useMemo(() => getTipRateHandler(sdk), [sdk])
  const getUnstakeFleetTokensTx = useMemo(() => getUnstakeFleetTokensTxHandler(sdk), [sdk])
  const getStakedBalance = useMemo(() => getStakedBalanceHandler(sdk), [sdk])
  const getUserBalance = useMemo(() => getUserBalanceHandler(sdk), [sdk])
  const getSummerPrice = useMemo(() => getSummerPriceHandler(sdk), [sdk])
  const isWhitelisted = useMemo(() => isWhitelistedHandler(sdk), [sdk])
  const setWhitelistedTx = useMemo(() => setWhitelistedTxHandler(sdk), [sdk])
  const setWhitelistedBatchTx = useMemo(() => setWhitelistedBatchTxHandler(sdk), [sdk])
  const isWhitelistedAQ = useMemo(() => isWhitelistedAQHandler(sdk), [sdk])
  const setWhitelistedAQTx = useMemo(() => setWhitelistedAQTxHandler(sdk), [sdk])
  const setWhitelistedBatchAQTx = useMemo(() => setWhitelistedBatchAQTxHandler(sdk), [sdk])

  // region Admin Handlers
  const grantContractSpecificRole = useMemo(() => grantContractSpecificRoleHandler(sdk), [sdk])
  const revokeContractSpecificRole = useMemo(() => revokeContractSpecificRoleHandler(sdk), [sdk])
  const getAllRoles = useMemo(() => getAllRolesHandler(sdk), [sdk])
  const setFleetDepositCap = useMemo(() => setFleetDepositCapHandler(sdk), [sdk])
  const setMinimumBufferBalance = useMemo(() => setMinimumBufferBalanceHandler(sdk), [sdk])
  const setArkDepositCap = useMemo(() => setArkDepositCapHandler(sdk), [sdk])

  const memo = useMemo(
    () => ({
      getCurrentUser,
      getWalletAddress,
      getChainInfo,
      getTargetChainInfo,
      getChain,
      getTokenBySymbol,
      getDepositTx,
      getWithdrawTx,
      getUserPositions,
      getUserPosition,
      getPositionHistory,
      getDeposits,
      getWithdrawals,
      getSwapQuote,
      getAggregatedRewards,
      getAggregatedRewardsIncludingMerkl,
      getAggregatedClaimsForChainTx,
      getBridgeTx,
      getCrossChainDepositTx,
      getCrossChainWithdrawTx,
      getDelegateTx,
      getDelegateTxV2,
      getStakeTx,
      getStakeTxV2,
      getStakeOnBehalfTxV2,
      getUndelegateTx,
      getUnstakeTx,
      getUnstakeTxV2,
      getUserStakesCount,
      getUserStakesV2,
      getStakingStakesV2,
      getCalculatePenaltyPercentage,
      getCalculatePenaltyAmount,
      getUserStakingBalanceV2,
      getUserStakingWeightedBalanceV2,
      getUserBlendedYieldBoost,
      getUserStakingEarnedV2,
      getUserStakingSumrStaked,
      getStakingRewardRatesV2,
      getStakingBucketsInfoV2,
      getStakingCalculateWeightedStakeV2,
      getStakingTotalWeightedSupplyV2,
      getStakingTotalSumrStakedV2,
      getStakingRevenueShareV2,
      getStakingSimulationDataV2,
      getStakingEarningsEstimationV2,
      getStakingConfigV2,
      getStakingStatsV2,
      getProtocolRevenue,
      getProtocolTvl,
      getUserDelegatee,
      getUserDelegateeV2,
      getUserStakedBalance,
      getUserVotes,
      getSummerToken,
      getUserBalance,
      getSummerPrice,
      getMigrateTx,
      getVaultSwitchTx,
      getMigratablePositions,
      getMigratablePositionsApy,
      getSpotPrice,
      getSpotPrices,
      getAuthorizeAsMerklRewardsOperatorTx,
      getReferralFeesMerklClaimTx,
      getUserMerklRewards,
      getUnstakeFleetTokensTx,
      getStakedBalance,
      getTipRate,
      isWhitelisted,
      setWhitelistedTx,
      setWhitelistedBatchTx,
      isWhitelistedAQ,
      setWhitelistedAQTx,
      setWhitelistedBatchAQTx,
      grantContractSpecificRole,
      revokeContractSpecificRole,
      getAllRoles,
      setFleetDepositCap,
      setMinimumBufferBalance,
      setArkDepositCap,
    }),
    [
      getCurrentUser,
      getWalletAddress,
      getChainInfo,
      getTargetChainInfo,
      getChain,
      getTokenBySymbol,
      getDepositTx,
      getWithdrawTx,
      getUserPositions,
      getUserPosition,
      getPositionHistory,
      getDeposits,
      getWithdrawals,
      getSwapQuote,
      getAggregatedRewards,
      getAggregatedRewardsIncludingMerkl,
      getAggregatedClaimsForChainTx,
      getDelegateTx,
      getDelegateTxV2,
      getBridgeTx,
      getStakeTx,
      getStakeTxV2,
      getStakeOnBehalfTxV2,
      getUndelegateTx,
      getUnstakeTx,
      getUnstakeTxV2,
      getUserStakesCount,
      getUserStakesV2,
      getStakingStakesV2,
      getCalculatePenaltyPercentage,
      getCalculatePenaltyAmount,
      getUserStakingBalanceV2,
      getUserStakingWeightedBalanceV2,
      getUserBlendedYieldBoost,
      getUserStakingEarnedV2,
      getUserStakingSumrStaked,
      getStakingRewardRatesV2,
      getStakingBucketsInfoV2,
      getStakingCalculateWeightedStakeV2,
      getStakingTotalWeightedSupplyV2,
      getStakingTotalSumrStakedV2,
      getStakingRevenueShareV2,
      getStakingSimulationDataV2,
      getStakingEarningsEstimationV2,
      getStakingConfigV2,
      getStakingStatsV2,
      getProtocolRevenue,
      getProtocolTvl,
      getUserDelegatee,
      getUserDelegateeV2,
      getUserStakedBalance,
      getUserVotes,
      getSummerToken,
      getUserBalance,
      getSummerPrice,
      getMigrateTx,
      getVaultSwitchTx,
      getMigratablePositions,
      getMigratablePositionsApy,
      getSpotPrice,
      getSpotPrices,
      getAuthorizeAsMerklRewardsOperatorTx,
      getReferralFeesMerklClaimTx,
      getUserMerklRewards,
      getUnstakeFleetTokensTx,
      getStakedBalance,
      getTipRate,
      isWhitelisted,
      setWhitelistedTx,
      setWhitelistedBatchTx,
      isWhitelistedAQ,
      setWhitelistedAQTx,
      setWhitelistedBatchAQTx,
      // region Admin Handlers
      grantContractSpecificRole,
      revokeContractSpecificRole,
      getAllRoles,
    ],
  )

  return memo
}

export type SdkClient = ReturnType<typeof useSDK>
