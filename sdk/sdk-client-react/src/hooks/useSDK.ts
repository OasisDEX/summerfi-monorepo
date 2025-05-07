import { makeSDK } from '@summerfi/sdk-client'
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
import { getMigratablePositionsHandler } from '../handlers/getMigratablePositionsHandler'
import { getMigratablePositionsHandlerApy } from '../handlers/getMigratablePositionsHandlerApy'
import { getSpotPriceHandler } from '../handlers/getSpotPriceHandler'
import { getSpotPricesHandler } from '../handlers/getSpotPricesHandler'

type UseSdk = {
  walletAddress?: string
  chainId?: number
}

export const useSDK = (params: UseSdk) => {
  const { apiURL } = useSDKContext()
  const sdk = useMemo(() => makeSDK({ apiURL }), [apiURL])

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
  const getMigratablePositions = useMemo(() => getMigratablePositionsHandler(sdk), [sdk])
  const getMigratablePositionsApy = useMemo(() => getMigratablePositionsHandlerApy(sdk), [sdk])

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
      getMigratablePositions,
      getMigratablePositionsApy,
      getSpotPrice,
      getSpotPrices,
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
      getMigratablePositions,
      getMigratablePositionsApy,
      getSpotPrice,
      getSpotPrices,
    ],
  )

  return memo
}

export type SdkClient = ReturnType<typeof useSDK>
