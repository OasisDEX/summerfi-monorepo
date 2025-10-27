import { makeAdminSDK, makeSDK } from '@summerfi/sdk-client'
import { useCallback, useMemo } from 'react'
import { getDepositTXHandler } from '../handlers/getDepositTXHandler'
import { getTokenBySymbolHandler } from '../handlers/getTokenBySymbolHandler'
import { getUserPositionsHandler } from '../handlers/getUserPositionsHandler'
import { getUserPositionHandler } from '../handlers/getUserPositionHandler'
import { getWithdrawTXHandler } from '../handlers/getWithdrawTXHandler'

import { useSDKContext } from '../components/SDKContext'
import { getChainHandler } from '../handlers/getChainHandler'
import { getWalletAddressHandler } from '../factories/getWalletAddressHandler'
import { getCurrentUserHandler } from '../handlers/getCurrentUserHandler'
import { getChainInfoHandler } from '../handlers/getChainInfoHandler'
import { getSwapQuoteHandler } from '../handlers/getSwapQuoteHandler'
import { getAggregatedRewardsHandler } from '../handlers/getAggregatedRewardsHandler'
import { getAggregatedClaimsForChainTXHandler } from '../handlers/getAggregatedClaimsForChainTXHandler'
import { getDelegateTxHandler } from '../handlers/getDelegateTxHandler'
import { getStakeTxHandler } from '../handlers/getStakeTxHandler'
import { getUndelegateTxHandler } from '../handlers/getUndelegateTxHandler'
import { getUnstakeTxHandler } from '../handlers/getUnstakeTxHandler'
import { getUserDelegateeHandler } from '../handlers/getUserDelegateeHandler'
import { getUserStakedBalanceHandler } from '../handlers/getUserStakedBalanceHandler'
import { getUserVotesHandler } from '../handlers/getUserVotesHandler'
import { getSummerTokenHandler } from '../handlers/getSummerTokenHandler'
import { getClaimableAggregatedRewardsHandler } from '../handlers/getClaimableAggregatedRewardsHandler'
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
import { getStakedBalanceHandler } from '../handlers/getStakedBalanceHandler'
import { getUnstakeFleetTokensTxHandler } from '../handlers/getUnstakeFleetTokensTxHandler'
import { isWhitelistedHandler } from '../handlers/isWhitelistedHandler'
import { setWhitelistedTxHandler } from '../handlers/setWhitelistedTxHandler'
import { setWhitelistedBatchTxHandler } from '../handlers/setWhitelistedBatchTxHandler'
import { isWhitelistedAQHandler } from '../handlers/isWhitelistedAQHandler'
import { setWhitelistedAQTxHandler } from '../handlers/setWhitelistedAQTxHandler'
import { setWhitelistedBatchAQTxHandler } from '../handlers/setWhitelistedBatchAQTxHandler'
import { grantContractSpecificRoleHandler } from '../handlers/grantContractSpecificRole'
import { revokeContractSpecificRoleHandler } from '../handlers/revokeContractSpecificRole'
import { getAllRolesHandler } from '../handlers/getAllRolesHandler'

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
  const getUserPosition = useMemo(() => getUserPositionHandler(sdk), [sdk])
  const getUserPositions = useMemo(() => getUserPositionsHandler(sdk), [sdk])

  // SWAPS
  const getSwapQuote = useMemo(() => getSwapQuoteHandler(sdk), [sdk])

  // ORACLES

  const getSpotPrice = useMemo(() => getSpotPriceHandler(sdk), [sdk])
  const getSpotPrices = useMemo(() => getSpotPricesHandler(sdk), [sdk])

  // CLAIMS
  const getAggregatedRewards = useMemo(() => getAggregatedRewardsHandler(sdk), [sdk])
  const getClaimableAggregatedRewards = useMemo(
    () => getClaimableAggregatedRewardsHandler(sdk),
    [sdk],
  )
  const getAggregatedClaimsForChainTx = useMemo(
    () => getAggregatedClaimsForChainTXHandler(sdk),
    [sdk],
  )

  const getBridgeTx = useMemo(() => getBridgeTxHandler(sdk), [sdk])
  const getDelegateTx = useMemo(() => getDelegateTxHandler(sdk), [sdk])
  const getStakeTx = useMemo(() => getStakeTxHandler(sdk), [sdk])
  const getUndelegateTx = useMemo(() => getUndelegateTxHandler(sdk), [sdk])
  const getUnstakeTx = useMemo(() => getUnstakeTxHandler(sdk), [sdk])
  const getUserDelegatee = useMemo(() => getUserDelegateeHandler(sdk), [sdk])
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
  const getUnstakeFleetTokensTx = useMemo(() => getUnstakeFleetTokensTxHandler(sdk), [sdk])
  const getStakedBalance = useMemo(() => getStakedBalanceHandler(sdk), [sdk])
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
      getSwapQuote,
      getAggregatedRewards,
      getClaimableAggregatedRewards,
      getAggregatedClaimsForChainTx,
      getBridgeTx,
      getDelegateTx,
      getStakeTx,
      getUndelegateTx,
      getUnstakeTx,
      getUserDelegatee,
      getUserStakedBalance,
      getUserVotes,
      getSummerToken,
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
      isWhitelisted,
      setWhitelistedTx,
      setWhitelistedBatchTx,
      isWhitelistedAQ,
      setWhitelistedAQTx,
      setWhitelistedBatchAQTx,
      grantContractSpecificRole,
      revokeContractSpecificRole,
      getAllRoles,
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
      getSwapQuote,
      getAggregatedRewards,
      getClaimableAggregatedRewards,
      getAggregatedClaimsForChainTx,
      getDelegateTx,
      getBridgeTx,
      getStakeTx,
      getUndelegateTx,
      getUnstakeTx,
      getUserDelegatee,
      getUserStakedBalance,
      getUserVotes,
      getSummerToken,
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
