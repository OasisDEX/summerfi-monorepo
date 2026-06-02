import { makeAdminSDK, makeInstiSdk, makeSDK } from '@summerfi/sdk-client'
import type { ISDKInstiManager, ISDKManager } from '@summerfi/sdk-client'
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
import { getVaultSwitchEnsoTxHandler } from '../handlers/getVaultSwitchEnsoTxHandler'
import { getMigratablePositionsHandler } from '../handlers/getMigratablePositionsHandler'
import { getMigratablePositionsHandlerApy } from '../handlers/getMigratablePositionsHandlerApy'
import { getSpotPriceHandler } from '../handlers/getSpotPriceHandler'
import { getSpotPricesHandler } from '../handlers/getSpotPricesHandler'
import { getAuthorizeAsMerklRewardsOperatorTxHandler } from '../handlers/getAuthorizeAsMerklRewardsOperatorTxHandler'
import { getReferralFeesMerklClaimTxHandler } from '../handlers/getReferralFeesMerklClaimTxHandler'
import { getVaultRewardsMerklClaimTxHandler } from '../handlers/getVaultRewardsMerklClaimTxHandler'
import { getClaimStakingV2UserRewardsTxHandler } from '../handlers/getClaimStakingV2UserRewardsTxHandler'
import { authorizeStakingRewardsCallerV2Handler } from '../handlers/authorizeStakingRewardsCallerV2Handler'
import { isAuthorizedStakingRewardsCallerV2Handler } from '../handlers/isAuthorizedStakingRewardsCallerV2Handler'
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
import { setArkMaxDepositPercentageOfTVLHandler } from '../handlers/setArkMaxDepositPercentageOfTVLHandler'
import { isPermit2AuthorizationNeededHandler } from '../handlers/isPermit2AuthorizationNeededHandler'
import { getPermit2AuthorizationTxHandler } from '../handlers/getPermit2AuthorizeTxHandler'
import { getPermit2RevokeTxHandler } from '../handlers/getPermit2UnauthorizeTxHandler'
import { getIntentSwapsSellOrderQuoteHandler } from '../handlers/getIntentSwapsSellOrderQuoteHandler'
import { getIntentSwapsSendDepositOrderHandler } from '../handlers/getIntentSwapsSendHookOrderHandler'
import { getIntentSwapsCancelOrderHandler } from '../handlers/getIntentSwapsCancelOrderHandler'
import { getIntentSwapsCheckOrderHandler } from '../handlers/getIntentSwapsCheckOrderHandler'
import { getAddressesHandler } from '../handlers/getAddressesHandler'
import { createStrategyTxHandler } from '../handlers/createStrategyTxHandler'
import { getStrategyHandler } from '../handlers/getStrategyHandler'
import { cancelStrategyTxHandler } from '../handlers/cancelStrategyTxHandler'
import { editStrategyTxHandler } from '../handlers/editStrategyTxHandler'
import { pauseStrategyTxHandler } from '../handlers/pauseStrategyTxHandler'
import { resumeStrategyTxHandler } from '../handlers/resumeStrategyTxHandler'
import { getRwaDepositTxHandler } from '../handlers/getRwaDepositTxHandler'
import { getRwaWithdrawTxHandler } from '../handlers/getRwaWithdrawTxHandler'
import { getRwaClaimSharesTxHandler } from '../handlers/getRwaClaimSharesTxHandler'
import { getRwaClaimAssetsTxHandler } from '../handlers/getRwaClaimAssetsTxHandler'
import { getRwaCancelRoundDepositTxHandler } from '../handlers/getRwaCancelRoundDepositTxHandler'
import { getRwaCurrentRoundHandler } from '../handlers/getRwaCurrentRoundHandler'
import { getRwaRoundStateHandler } from '../handlers/getRwaRoundStateHandler'
import { getRwaExchangeRateHandler } from '../handlers/getRwaExchangeRateHandler'
import { getRwaReceiptBalancesHandler } from '../handlers/getRwaReceiptBalancesHandler'
import { getRwaSetMinimumPositionSizeTxHandler } from '../handlers/getRwaSetMinimumPositionSizeTxHandler'
import { getRwaSetWhitelistedTxHandler } from '../handlers/getRwaSetWhitelistedTxHandler'
import { getRwaSetWhitelistedBatchTxHandler } from '../handlers/getRwaSetWhitelistedBatchTxHandler'
import { getRwaSetWhitelistOpenTxHandler } from '../handlers/getRwaSetWhitelistOpenTxHandler'
import { getRwaIsWhitelistedHandler } from '../handlers/getRwaIsWhitelistedHandler'
import { getRwaIsWhitelistOpenHandler } from '../handlers/getRwaIsWhitelistOpenHandler'

type UseSdk = {
  walletAddress?: string
  chainId?: number
  clientId?: string
  insti?: boolean
}

type SdkStateParams = {
  chainId?: number
  walletAddress?: string
}

/**
 * Handlers available on every SDK instance — both the public `makeSDK` instance and the managed
 * (`makeAdminSDK` / `makeInstiSdk`) instances. These only touch `ISDKManager` members, so an
 * `ISDKInstiManager` (a structural superset) satisfies the parameter too.
 */
const useSDKManagerHandlers = (
  sdk: ISDKManager,
  { chainId, walletAddress: walletAddressString }: SdkStateParams,
) => {
  // region SDK State
  const getChain = useMemo(() => getChainHandler(sdk), [sdk, chainId])
  const getChainInfo = useMemo(() => getChainInfoHandler(chainId), [chainId])
  const getTargetChainInfo = useCallback((specificChainId: number) => {
    const chainInfoFn = getChainInfoHandler(specificChainId)
    return chainInfoFn()
  }, [])

  const getWalletAddress = useMemo(
    () => getWalletAddressHandler(walletAddressString),
    [walletAddressString],
  )
  const getCurrentUser = useMemo(
    () => getCurrentUserHandler(getChainInfo, getWalletAddress),
    [getCurrentUserHandler, getChainInfo, getWalletAddress],
  )

  // region Utils
  const getSummerToken = useMemo(() => getSummerTokenHandler(sdk), [sdk])
  const getAddresses = useMemo(() => getAddressesHandler(sdk), [sdk])
  const getSummerPrice = useMemo(() => getSummerPriceHandler(sdk), [sdk])

  // region Tokens
  const getTokenBySymbol = useMemo(() => getTokenBySymbolHandler(getChain), [getChain])

  // region Swaps
  const getSwapQuote = useMemo(() => getSwapQuoteHandler(sdk), [sdk])

  // region Intent Swaps
  const getIntentSwapsSellOrderQuote = useMemo(
    () => getIntentSwapsSellOrderQuoteHandler(sdk),
    [sdk],
  )
  const getIntentSwapsSendDepositOrder = useMemo(
    () => getIntentSwapsSendDepositOrderHandler(sdk),
    [sdk],
  )
  const getIntentSwapsCancelOrder = useMemo(() => getIntentSwapsCancelOrderHandler(sdk), [sdk])
  const getIntentSwapsCheckOrder = useMemo(() => getIntentSwapsCheckOrderHandler(sdk), [sdk])
  const getIntentSwapsIsPermit2AuthorizationNeeded = useMemo(
    () => isPermit2AuthorizationNeededHandler(sdk),
    [sdk],
  )
  const getIntentSwapsPermit2AuthorizationTx = useMemo(
    () => getPermit2AuthorizationTxHandler(sdk),
    [sdk],
  )
  const getIntentSwapsPermit2RevokeTx = useMemo(() => getPermit2RevokeTxHandler(sdk), [sdk])

  // region Oracles
  const getSpotPrice = useMemo(() => getSpotPriceHandler(sdk), [sdk])
  const getSpotPrices = useMemo(() => getSpotPricesHandler(sdk), [sdk])

  // region Vaults
  const getWithdrawTx = useMemo(() => getWithdrawTXHandler(sdk), [sdk])
  const getDepositTx = useMemo(() => getDepositTXHandler(sdk), [sdk])
  const getCrossChainDepositTx = useMemo(() => getCrossChainDepositTxHandler(sdk), [sdk])
  const getCrossChainWithdrawTx = useMemo(() => getCrossChainWithdrawTxHandler(sdk), [sdk])
  const getUserPosition = useMemo(() => getUserPositionHandler(sdk), [sdk])
  const getUserPositions = useMemo(() => getUserPositionsHandler(sdk), [sdk])
  const getBridgeTx = useMemo(() => getBridgeTxHandler(sdk), [sdk])

  // region Claims
  const getAggregatedRewards = useMemo(() => getAggregatedRewardsHandler(sdk), [sdk])
  const getAggregatedRewardsIncludingMerkl = useMemo(
    () => getAggregatedRewardsIncludingMerklHandler(sdk),
    [sdk],
  )
  const getAggregatedClaimsForChainTx = useMemo(
    () => getAggregatedClaimsForChainTXHandler(sdk),
    [sdk],
  )

  // region Governance
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
  const getMigrateTx = useMemo(() => getMigrateTxHandler(sdk), [sdk])
  const getVaultSwitchTx = useMemo(() => getVaultSwitchTXHandler(sdk), [sdk])
  const getVaultSwitchEnsoTx = useMemo(() => getVaultSwitchEnsoTxHandler(sdk), [sdk])
  const getMigratablePositions = useMemo(() => getMigratablePositionsHandler(sdk), [sdk])
  const getMigratablePositionsApy = useMemo(() => getMigratablePositionsHandlerApy(sdk), [sdk])
  const getAuthorizeAsMerklRewardsOperatorTx = useMemo(
    () => getAuthorizeAsMerklRewardsOperatorTxHandler(sdk),
    [sdk],
  )
  const getReferralFeesMerklClaimTx = useMemo(() => getReferralFeesMerklClaimTxHandler(sdk), [sdk])
  const getVaultRewardsMerklClaimTx = useMemo(() => getVaultRewardsMerklClaimTxHandler(sdk), [sdk])
  const getClaimStakingV2UserRewardsTx = useMemo(
    () => getClaimStakingV2UserRewardsTxHandler(sdk),
    [sdk],
  )
  const authorizeStakingRewardsCallerV2 = useMemo(
    () => authorizeStakingRewardsCallerV2Handler(sdk),
    [sdk],
  )
  const isAuthorizedStakingRewardsCallerV2 = useMemo(
    () => isAuthorizedStakingRewardsCallerV2Handler(sdk),
    [sdk],
  )
  const getUserMerklRewards = useMemo(() => getUserMerklRewardsHandler(sdk), [sdk])
  const getPositionHistory = useMemo(() => getPositionHistoryHandler(sdk), [sdk])
  const getDeposits = useMemo(() => getDepositsHandler(sdk), [sdk])
  const getWithdrawals = useMemo(() => getWithdrawalsHandler(sdk), [sdk])
  const getUnstakeFleetTokensTx = useMemo(() => getUnstakeFleetTokensTxHandler(sdk), [sdk])
  const getStakedBalance = useMemo(() => getStakedBalanceHandler(sdk), [sdk])
  const getUserBalance = useMemo(() => getUserBalanceHandler(sdk), [sdk])

  // region Allowances
  const isPermit2AuthorizationNeeded = useMemo(
    () => isPermit2AuthorizationNeededHandler(sdk),
    [sdk],
  )
  const getPermit2AuthorizationTx = useMemo(() => getPermit2AuthorizationTxHandler(sdk), [sdk])
  const getPermit2RevokeTx = useMemo(() => getPermit2RevokeTxHandler(sdk), [sdk])

  // region DCA
  const createStrategyTx = useMemo(() => createStrategyTxHandler(sdk), [sdk])
  const editStrategyTx = useMemo(() => editStrategyTxHandler(sdk), [sdk])
  const pauseStrategyTx = useMemo(() => pauseStrategyTxHandler(sdk), [sdk])
  const resumeStrategyTx = useMemo(() => resumeStrategyTxHandler(sdk), [sdk])
  const cancelStrategyTx = useMemo(() => cancelStrategyTxHandler(sdk), [sdk])
  const getStrategy = useMemo(() => getStrategyHandler(sdk), [sdk])

  return useMemo(
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
      getVaultSwitchEnsoTx,
      getMigratablePositions,
      getMigratablePositionsApy,
      getSpotPrice,
      getSpotPrices,
      getAuthorizeAsMerklRewardsOperatorTx,
      getReferralFeesMerklClaimTx,
      getVaultRewardsMerklClaimTx,
      getClaimStakingV2UserRewardsTx,
      authorizeStakingRewardsCallerV2,
      isAuthorizedStakingRewardsCallerV2,
      getUserMerklRewards,
      getUnstakeFleetTokensTx,
      getStakedBalance,
      isPermit2AuthorizationNeeded,
      getPermit2AuthorizationTx,
      getPermit2RevokeTx,
      getIntentSwapsSellOrderQuote,
      getIntentSwapsSendDepositOrder,
      getIntentSwapsCancelOrder,
      getIntentSwapsCheckOrder,
      getIntentSwapsIsPermit2AuthorizationNeeded,
      getIntentSwapsPermit2AuthorizationTx,
      getIntentSwapsPermit2RevokeTx,
      getAddresses,
      createStrategyTx,
      editStrategyTx,
      pauseStrategyTx,
      resumeStrategyTx,
      cancelStrategyTx,
      getStrategy,
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
      getVaultSwitchEnsoTx,
      getMigratablePositions,
      getMigratablePositionsApy,
      getSpotPrice,
      getSpotPrices,
      getAuthorizeAsMerklRewardsOperatorTx,
      getReferralFeesMerklClaimTx,
      getVaultRewardsMerklClaimTx,
      getClaimStakingV2UserRewardsTx,
      authorizeStakingRewardsCallerV2,
      isAuthorizedStakingRewardsCallerV2,
      getUserMerklRewards,
      getUnstakeFleetTokensTx,
      getStakedBalance,
      isPermit2AuthorizationNeeded,
      getPermit2AuthorizationTx,
      getPermit2RevokeTx,
      getIntentSwapsSellOrderQuote,
      getIntentSwapsSendDepositOrder,
      getIntentSwapsCancelOrder,
      getIntentSwapsCheckOrder,
      getIntentSwapsIsPermit2AuthorizationNeeded,
      getIntentSwapsPermit2AuthorizationTx,
      getIntentSwapsPermit2RevokeTx,
      getAddresses,
      createStrategyTx,
      editStrategyTx,
      pauseStrategyTx,
      resumeStrategyTx,
      cancelStrategyTx,
      getStrategy,
    ],
  )
}

/**
 * Admin + RWA handlers. These touch `ISDKInstiManager`-only members (`sdk.armada.admin`,
 * `sdk.armada.accessControl`, `sdk.rwa`) and are therefore exposed only for managed instances
 * created via `makeAdminSDK` / `makeInstiSdk`.
 */
const useSDKInstiManagerHandlers = (sdk: ISDKInstiManager) => {
  // region Admin Handlers
  const isWhitelisted = useMemo(() => isWhitelistedHandler(sdk), [sdk])
  const setWhitelistedTx = useMemo(() => setWhitelistedTxHandler(sdk), [sdk])
  const setWhitelistedBatchTx = useMemo(() => setWhitelistedBatchTxHandler(sdk), [sdk])
  const isWhitelistedAQ = useMemo(() => isWhitelistedAQHandler(sdk), [sdk])
  const setWhitelistedAQTx = useMemo(() => setWhitelistedAQTxHandler(sdk), [sdk])
  const setWhitelistedBatchAQTx = useMemo(() => setWhitelistedBatchAQTxHandler(sdk), [sdk])
  const grantContractSpecificRole = useMemo(() => grantContractSpecificRoleHandler(sdk), [sdk])
  const revokeContractSpecificRole = useMemo(() => revokeContractSpecificRoleHandler(sdk), [sdk])
  const getAllRoles = useMemo(() => getAllRolesHandler(sdk), [sdk])
  const setFleetDepositCap = useMemo(() => setFleetDepositCapHandler(sdk), [sdk])
  const setMinimumBufferBalance = useMemo(() => setMinimumBufferBalanceHandler(sdk), [sdk])
  const setArkDepositCap = useMemo(() => setArkDepositCapHandler(sdk), [sdk])
  const setArkMaxDepositPercentageOfTVL = useMemo(
    () => setArkMaxDepositPercentageOfTVLHandler(sdk),
    [sdk],
  )
  const getTipRate = useMemo(() => getTipRateHandler(sdk), [sdk])

  // region RWA
  const getRwaDepositTx = useMemo(() => getRwaDepositTxHandler(sdk), [sdk])
  const getRwaWithdrawTx = useMemo(() => getRwaWithdrawTxHandler(sdk), [sdk])
  const getRwaClaimSharesTx = useMemo(() => getRwaClaimSharesTxHandler(sdk), [sdk])
  const getRwaClaimAssetsTx = useMemo(() => getRwaClaimAssetsTxHandler(sdk), [sdk])
  const getRwaCancelRoundDepositTx = useMemo(() => getRwaCancelRoundDepositTxHandler(sdk), [sdk])
  const getRwaCurrentRound = useMemo(() => getRwaCurrentRoundHandler(sdk), [sdk])
  const getRwaRoundState = useMemo(() => getRwaRoundStateHandler(sdk), [sdk])
  const getRwaExchangeRate = useMemo(() => getRwaExchangeRateHandler(sdk), [sdk])
  const getRwaReceiptBalances = useMemo(() => getRwaReceiptBalancesHandler(sdk), [sdk])
  const getRwaSetMinimumPositionSizeTx = useMemo(
    () => getRwaSetMinimumPositionSizeTxHandler(sdk),
    [sdk],
  )
  const getRwaSetWhitelistedTx = useMemo(() => getRwaSetWhitelistedTxHandler(sdk), [sdk])
  const getRwaSetWhitelistedBatchTx = useMemo(() => getRwaSetWhitelistedBatchTxHandler(sdk), [sdk])
  const getRwaSetWhitelistOpenTx = useMemo(() => getRwaSetWhitelistOpenTxHandler(sdk), [sdk])
  const getRwaIsWhitelisted = useMemo(() => getRwaIsWhitelistedHandler(sdk), [sdk])
  const getRwaIsWhitelistOpen = useMemo(() => getRwaIsWhitelistOpenHandler(sdk), [sdk])

  return useMemo(
    () => ({
      // Admin
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
      setArkMaxDepositPercentageOfTVL,
      // RWA
      getRwaDepositTx,
      getRwaWithdrawTx,
      getRwaClaimSharesTx,
      getRwaClaimAssetsTx,
      getRwaCancelRoundDepositTx,
      getRwaCurrentRound,
      getRwaRoundState,
      getRwaExchangeRate,
      getRwaReceiptBalances,
      getRwaSetMinimumPositionSizeTx,
      getRwaSetWhitelistedTx,
      getRwaSetWhitelistedBatchTx,
      getRwaSetWhitelistOpenTx,
      getRwaIsWhitelisted,
      getRwaIsWhitelistOpen,
    }),
    [
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
      setArkMaxDepositPercentageOfTVL,
      getRwaDepositTx,
      getRwaWithdrawTx,
      getRwaClaimSharesTx,
      getRwaClaimAssetsTx,
      getRwaCancelRoundDepositTx,
      getRwaCurrentRound,
      getRwaRoundState,
      getRwaExchangeRate,
      getRwaReceiptBalances,
      getRwaSetMinimumPositionSizeTx,
      getRwaSetWhitelistedTx,
      getRwaSetWhitelistedBatchTx,
      getRwaSetWhitelistOpenTx,
      getRwaIsWhitelisted,
      getRwaIsWhitelistOpen,
    ],
  )
}

/**
 * Managed (admin / institutional) clients expose the full surface: every `ISDKManager` method plus
 * the admin + RWA handlers. A `clientId` (passed by `makeAdminSDK` / `makeInstiSdk`) selects this.
 */
export function useSDK(params: UseSdk & { clientId: string }): SdkInstiManagerClient
/** Public clients (`makeSDK`, no `clientId`) expose only the `ISDKManager` surface. */
export function useSDK(params: UseSdk): SdkManagerClient
export function useSDK(params: UseSdk): SdkManagerClient | SdkInstiManagerClient {
  const { apiURL } = useSDKContext()
  const sdk = useMemo(() => {
    if (params.insti && params.clientId) {
      return makeInstiSdk({ apiURL, clientId: params.clientId })
    } else if (params.clientId) {
      return makeAdminSDK({ apiURL, clientId: params.clientId })
    }
    return makeSDK({ apiURL })
  }, [apiURL, params.clientId, params.insti])

  // A `clientId` is only ever present for managed (admin/insti) instances, which are
  // `ISDKInstiManager`s. Public `makeSDK` instances have no `clientId`.
  const isManaged = Boolean(params.clientId)

  const managerHandlers = useSDKManagerHandlers(sdk, {
    chainId: params.chainId,
    walletAddress: params.walletAddress,
  })
  // Hooks must run unconditionally. For public instances the admin/RWA handlers are built but never
  // returned, so they are never invoked — the cast is safe because their factories only capture the
  // sdk reference (they touch `sdk.rwa` etc. lazily, at call time, which only happens when managed).
  const instiManagerHandlers = useSDKInstiManagerHandlers(sdk as ISDKInstiManager)

  return useMemo(
    () => (isManaged ? { ...managerHandlers, ...instiManagerHandlers } : managerHandlers),
    [isManaged, managerHandlers, instiManagerHandlers],
  )
}

/** Surface returned for a public (`makeSDK`) instance — `ISDKManager` handlers only. */
export type SdkManagerClient = ReturnType<typeof useSDKManagerHandlers>
/** Surface returned for a managed (admin / institutional) instance — all handlers. */
export type SdkInstiManagerClient = SdkManagerClient & ReturnType<typeof useSDKInstiManagerHandlers>
/** Backwards-compatible alias for the full (managed) client surface. */
export type SdkClient = SdkInstiManagerClient