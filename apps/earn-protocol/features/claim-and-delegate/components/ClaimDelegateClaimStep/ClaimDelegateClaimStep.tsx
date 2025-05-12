import { type Dispatch, type FC, useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useChain } from '@account-kit/react'
import { SUMR_CAP, useLocalConfig } from '@summerfi/app-earn-ui'
import { SDKChainId, type SDKSupportedChain } from '@summerfi/app-types'
import {
  chainIdToSDKNetwork,
  isSupportedHumanNetwork,
  sdkNetworkToHumanNetwork,
  sdkNetworkToHumanNetworkStrict,
} from '@summerfi/app-utils'
import { redirect, useParams, useSearchParams } from 'next/navigation'

import { SDKChainIdToAAChainMap } from '@/account-kit/config'
import { TermsOfServiceCookiePrefix } from '@/constants/terms-of-service'
import { useClaimSumrTransaction } from '@/features/claim-and-delegate/hooks/use-claim-sumr-transaction'
import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  ClaimDelegateSteps,
  ClaimDelegateTxStatuses,
} from '@/features/claim-and-delegate/types'
import { ERROR_TOAST_CONFIG, SUCCESS_TOAST_CONFIG } from '@/features/toastify/config'
import { useClientChainId } from '@/hooks/use-client-chain-id'
import { useRiskVerification } from '@/hooks/use-risk-verification'

import { ClaimDelegateError, ClaimDelegateNoBalances } from './ClaimDelegateError'
import { ClaimDelegateFooter } from './ClaimDelegateFooter'
import { ClaimDelegateNetworkCard } from './ClaimDelegateNetworkCard'

import classNames from './ClaimDelegateClaimStep.module.css'

const delayPerNetwork = {
  [SDKChainId.BASE]: 4000,
  [SDKChainId.ARBITRUM]: 4000,
  [SDKChainId.MAINNET]: 13000,
  [SDKChainId.SONIC]: 4000,
} as const

const claimItems: {
  chainId: SDKSupportedChain
}[] = [
  {
    chainId: SDKChainId.BASE,
  },
  {
    chainId: SDKChainId.ARBITRUM,
  },
  {
    chainId: SDKChainId.MAINNET,
  },
  {
    chainId: SDKChainId.SONIC,
  },
]

interface ClaimDelegateClaimStepProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
  externalData: ClaimDelegateExternalData
}

export const ClaimDelegateClaimStep: FC<ClaimDelegateClaimStepProps> = ({
  state,
  dispatch,
  externalData: initialExternalData,
}) => {
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const { walletAddress } = useParams()
  const resolvedWalletAddress = (
    Array.isArray(walletAddress) ? walletAddress[0] : walletAddress
  ) as string
  const searchParams = useSearchParams()
  const viaParam = searchParams.get('via')
  const hasReturnedToClaimStep = viaParam === 'bridge'

  const { checkRisk } = useRiskVerification({
    cookiePrefix: TermsOfServiceCookiePrefix.SUMR_CLAIM_TOKEN,
  })

  const { setChain, isSettingChain } = useChain()
  const { clientChainId } = useClientChainId() as {
    clientChainId: SDKSupportedChain
  }

  const handleClaimError = useCallback(() => {
    dispatch({ type: 'update-claim-status', payload: ClaimDelegateTxStatuses.FAILED })
    dispatch({ type: 'set-pending-claim', payload: undefined })
    toast.error('Failed to claim $SUMR tokens', ERROR_TOAST_CONFIG)
  }, [dispatch])

  const { claimSumrTransaction } = useClaimSumrTransaction({
    onSuccess: () => {
      setTimeout(() => {
        // Get the network name for the current chain
        const humanNetwork = sdkNetworkToHumanNetwork(chainIdToSDKNetwork(clientChainId))

        if (!isSupportedHumanNetwork(humanNetwork)) {
          throw new Error(`Unsupported network: ${humanNetwork}`)
        }

        // Update claimable balances - set the claimed amount to 0
        dispatch({
          type: 'update-claimable-balances',
          payload: {
            ...state.claimableBalances,
            [clientChainId]: 0,
          },
        })

        // Update wallet balances - add claimed amount to the existing balance
        const claimedAmount =
          initialExternalData.sumrToClaim.claimableAggregatedRewards.perChain[clientChainId] || 0

        dispatch({
          type: 'update-wallet-balances',
          payload: {
            ...state.walletBalances,
            [humanNetwork]: Number(state.walletBalances[humanNetwork]) + claimedAmount,
          },
        })

        dispatch({ type: 'update-claim-status', payload: ClaimDelegateTxStatuses.COMPLETED })
        toast.success('Claimed $SUMR tokens successfully', SUCCESS_TOAST_CONFIG)
      }, delayPerNetwork[clientChainId])
    },
    onError: () => {
      handleClaimError()
    },
  })

  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  const handleClaim = useCallback(async () => {
    dispatch({ type: 'update-claim-status', payload: ClaimDelegateTxStatuses.PENDING })

    const risk = await checkRisk()

    if (risk.isRisky) {
      handleClaimError()

      return
    }

    await claimSumrTransaction().catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error claiming $SUMR:', err)
    })
  }, [dispatch, checkRisk, claimSumrTransaction, handleClaimError])

  // Watch for chain changes and trigger claim if pending
  useEffect(() => {
    let isMounted = true

    if (
      state.pendingClaimChainId &&
      clientChainId === state.pendingClaimChainId &&
      !isSettingChain &&
      !state.claimStatus
    ) {
      handleClaim()
        .then(() => {
          if (isMounted) {
            dispatch({ type: 'set-pending-claim', payload: undefined })
          }
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Error claiming $SUMR:', err)
          dispatch({ type: 'set-pending-claim', payload: undefined })
        })
    }

    return () => {
      isMounted = false
    }
  }, [
    clientChainId,
    state.pendingClaimChainId,
    isSettingChain,
    handleClaim,
    dispatch,
    state.claimStatus,
  ])

  const hasClaimedAtLeastOneChain = state.claimStatus === ClaimDelegateTxStatuses.COMPLETED

  // Use the balances from the global state instead of local state
  const baseBalance = state.walletBalances.base || 0
  const canContinue = (baseBalance > 0 && hasClaimedAtLeastOneChain) || hasReturnedToClaimStep

  const handleAccept = () => {
    dispatch({ type: 'update-step', payload: ClaimDelegateSteps.DELEGATE })
  }

  const handleClaimClick = (chainId: SDKSupportedChain) => {
    // Prevent multiple simultaneous claims
    if (state.claimStatus === ClaimDelegateTxStatuses.PENDING || isSettingChain) {
      return
    }

    if (clientChainId !== chainId) {
      dispatch({ type: 'set-pending-claim', payload: chainId })
      setChain({ chain: SDKChainIdToAAChainMap[chainId] })

      return
    }
    handleClaim()
  }

  const satelliteClaimItems = claimItems.filter((item) => item.chainId !== SDKChainId.BASE)

  // Check if there are any claimable balances using the global state
  const hasClaimableBalance = Object.values(state.claimableBalances).some((amount) => amount > 0)

  // Check if there are any bridgeable balances using the global state
  const hasBridgeableBalance = satelliteClaimItems.some((item) => {
    try {
      const humanNetwork = sdkNetworkToHumanNetworkStrict(chainIdToSDKNetwork(item.chainId))

      return (Number(state.walletBalances[humanNetwork]) || 0) > 0
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error checking bridgeable balance:', error)

      return false
    }
  })

  if (
    !hasClaimableBalance &&
    !hasBridgeableBalance &&
    !hasReturnedToClaimStep &&
    !hasClaimedAtLeastOneChain &&
    state.claimStatus !== ClaimDelegateTxStatuses.PENDING
  ) {
    return <ClaimDelegateNoBalances onContinue={handleAccept} />
  }

  if (!isSupportedHumanNetwork(sdkNetworkToHumanNetwork(chainIdToSDKNetwork(clientChainId)))) {
    const handleBackToPortfolio = () => {
      redirect(`/earn/portfolio/${resolvedWalletAddress}`)
    }

    return (
      <div className={classNames.claimDelegateClaimStepWrapper}>
        <ClaimDelegateError error="Unsupported network" onBack={handleBackToPortfolio} />
      </div>
    )
  }

  return (
    <div className={classNames.claimDelegateClaimStepWrapper}>
      {/* Base network card */}
      <ClaimDelegateNetworkCard
        chainId={SDKChainId.BASE}
        claimableAmount={state.claimableBalances[SDKChainId.BASE] || 0}
        balance={state.walletBalances.base || 0}
        estimatedSumrPrice={estimatedSumrPrice}
        walletAddress={resolvedWalletAddress}
        onClaim={() => handleClaimClick(SDKChainId.BASE)}
        isLoading={
          state.claimStatus === ClaimDelegateTxStatuses.PENDING &&
          (state.pendingClaimChainId === SDKChainId.BASE || clientChainId === SDKChainId.BASE)
        }
        isChangingNetwork={isSettingChain && state.pendingClaimChainId === SDKChainId.BASE}
        isChangingNetworkTo={state.pendingClaimChainId}
        isOnlyStep
      />

      {/* Satellite network cards */}
      {satelliteClaimItems.map((item) => {
        const network = sdkNetworkToHumanNetwork(chainIdToSDKNetwork(item.chainId))

        if (!isSupportedHumanNetwork(network)) return null

        return (
          <ClaimDelegateNetworkCard
            key={item.chainId}
            chainId={item.chainId}
            claimableAmount={state.claimableBalances[item.chainId] || 0}
            balance={state.walletBalances[network] || 0}
            estimatedSumrPrice={estimatedSumrPrice}
            walletAddress={resolvedWalletAddress}
            onClaim={() => handleClaimClick(item.chainId)}
            isLoading={
              state.claimStatus === ClaimDelegateTxStatuses.PENDING &&
              (state.pendingClaimChainId === item.chainId || clientChainId === item.chainId)
            }
            isChangingNetwork={isSettingChain && state.pendingClaimChainId === item.chainId}
            isChangingNetworkTo={state.pendingClaimChainId}
          />
        )
      })}

      <ClaimDelegateFooter canContinue={canContinue} onContinue={handleAccept} />
    </div>
  )
}
