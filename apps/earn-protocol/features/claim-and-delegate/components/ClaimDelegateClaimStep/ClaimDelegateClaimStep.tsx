import { type Dispatch, type FC, useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useChain } from '@account-kit/react'
import {
  ERROR_TOAST_CONFIG,
  MobileDrawer,
  Modal,
  SDKChainIdToAAChainMap,
  SUCCESS_TOAST_CONFIG,
  useClientChainId,
  useMobileCheck,
  useUserWallet,
} from '@summerfi/app-earn-ui'
import { SupportedNetworkIds, UiTransactionStatuses } from '@summerfi/app-types'
import {
  chainIdToSDKNetwork,
  isSupportedHumanNetwork,
  sdkNetworkToHumanNetwork,
  sdkNetworkToHumanNetworkStrict,
} from '@summerfi/app-utils'
import { redirect, useParams, useRouter, useSearchParams } from 'next/navigation'

import { delayPerNetwork } from '@/constants/delay-per-network'
import { TermsOfServiceCookiePrefix } from '@/constants/terms-of-service'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { ClaimDelegateOptInMerkl } from '@/features/claim-and-delegate/components/ClaimDelegateOptInMerkl/ClaimDelegateOptInMerkl'
import { useClaimSumrTransaction } from '@/features/claim-and-delegate/hooks/use-claim-sumr-transaction'
import { useMerklOptInTransaction } from '@/features/claim-and-delegate/hooks/use-merkl-opt-in-transaction'
import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  ClaimDelegateSteps,
} from '@/features/claim-and-delegate/types'
import { useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'
import { useRevalidateUser } from '@/hooks/use-revalidate'
import { useRiskVerification } from '@/hooks/use-risk-verification'

import { ClaimDelegateError, ClaimDelegateNoBalances } from './ClaimDelegateError'
import { ClaimDelegateFooter } from './ClaimDelegateFooter'
import { ClaimDelegateNetworkCard } from './ClaimDelegateNetworkCard'

import classNames from './ClaimDelegateClaimStep.module.css'

const claimItems = [
  {
    chainId: SupportedNetworkIds.Base,
  },
  {
    chainId: SupportedNetworkIds.ArbitrumOne,
  },
  {
    chainId: SupportedNetworkIds.Mainnet,
  },
  {
    chainId: SupportedNetworkIds.SonicMainnet,
  },
]

interface ClaimDelegateClaimStepProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
  externalData: ClaimDelegateExternalData
  isJustClaim?: boolean
  sumrPriceUsd: number
}

export const ClaimDelegateClaimStep: FC<ClaimDelegateClaimStepProps> = ({
  state,
  dispatch,
  externalData: initialExternalData,
  isJustClaim,
  sumrPriceUsd,
}) => {
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const [isOptInOpen, setIsOptInOpen] = useState(false)

  const merklIsAuthorizedOnBase = state.merklIsAuthorizedPerChain[SupportedNetworkIds.Base]

  const { walletAddress } = useParams()
  const { push } = useRouter()
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
  const { clientChainId } = useClientChainId()
  const { publicClient } = useNetworkAlignedClient({
    overrideNetwork: sdkNetworkToHumanNetwork(chainIdToSDKNetwork(clientChainId)),
  })
  const { userWalletAddress } = useUserWallet()
  const revalidateUser = useRevalidateUser()
  const isOwner = state.walletAddress.toLowerCase() === userWalletAddress?.toLowerCase()

  const handleOptInOpenClose = () => setIsOptInOpen((prev) => !prev)

  const handleClaimError = useCallback(() => {
    dispatch({ type: 'update-claim-status', payload: UiTransactionStatuses.FAILED })
    dispatch({ type: 'set-pending-claim', payload: undefined })
    toast.error('Failed to claim $SUMR tokens', ERROR_TOAST_CONFIG)
  }, [dispatch])

  const { merklOptInTransaction } = useMerklOptInTransaction({
    onSuccess: () => {
      setTimeout(() => {
        dispatch({ type: 'update-merkl-status', payload: UiTransactionStatuses.COMPLETED })
        dispatch({
          type: 'update-merkl-is-authorized-per-chain',
          payload: {
            ...state.merklIsAuthorizedPerChain,
            [clientChainId]: true,
          },
        })
        toast.success('Merkl approval successful', SUCCESS_TOAST_CONFIG)
        handleOptInOpenClose()
      }, delayPerNetwork[clientChainId])
    },
    onError: () => {
      dispatch({ type: 'update-merkl-status', payload: UiTransactionStatuses.FAILED })
      toast.error('Merkl approval failed', ERROR_TOAST_CONFIG)
    },
    network: chainIdToSDKNetwork(clientChainId),
    publicClient,
  })

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
          initialExternalData.sumrToClaim.aggregatedRewards.perChain[clientChainId] || 0

        dispatch({
          type: 'update-wallet-balances',
          payload: {
            ...state.walletBalances,
            [humanNetwork]: Number(state.walletBalances[humanNetwork]) + claimedAmount,
          },
        })

        dispatch({ type: 'update-claim-status', payload: UiTransactionStatuses.COMPLETED })
        toast.success('Claimed $SUMR tokens successfully', SUCCESS_TOAST_CONFIG)
        revalidateUser(resolvedWalletAddress)
      }, delayPerNetwork[clientChainId])
    },
    onError: () => {
      revalidateUser(resolvedWalletAddress)
      handleClaimError()
    },
    network: chainIdToSDKNetwork(clientChainId),
    publicClient,
  })

  const handleClaim = useCallback(async () => {
    dispatch({ type: 'update-claim-status', payload: UiTransactionStatuses.PENDING })

    const risk = await checkRisk()

    if (risk.isRisky) {
      handleClaimError()

      return
    }

    await claimSumrTransaction().catch((err) => {
      dispatch({ type: 'update-claim-status', payload: UiTransactionStatuses.FAILED })
      toast.error('Failed to claim $SUMR tokens', ERROR_TOAST_CONFIG)
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

  const hasClaimedAtLeastOneChain = state.claimStatus === UiTransactionStatuses.COMPLETED

  // Use the balances from the global state instead of local state
  const baseBalance = state.walletBalances.base || 0
  const canContinue = (baseBalance > 0 && hasClaimedAtLeastOneChain) || hasReturnedToClaimStep

  const handleAccept = () => {
    if (isJustClaim) {
      push(`/portfolio/${resolvedWalletAddress}`)

      return
    }
    dispatch({ type: 'update-step', payload: ClaimDelegateSteps.DELEGATE })
  }

  const handleClaimClick = (chainId: SupportedNetworkIds) => {
    // Prevent multiple simultaneous claims
    if (state.claimStatus === UiTransactionStatuses.PENDING || isSettingChain) {
      return
    }

    if (Number(clientChainId) !== Number(chainId)) {
      dispatch({ type: 'set-pending-claim', payload: chainId })
      setChain({ chain: SDKChainIdToAAChainMap[chainId] })

      return
    }
    handleClaim().catch((err) => {
      dispatch({ type: 'update-claim-status', payload: UiTransactionStatuses.FAILED })
      toast.error('Failed to claim $SUMR tokens', ERROR_TOAST_CONFIG)
      // eslint-disable-next-line no-console
      console.error('Error claiming $SUMR:', err)
    })
  }

  const satelliteClaimItems = claimItems.filter((item) => item.chainId !== SupportedNetworkIds.Base)

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
    state.claimStatus !== UiTransactionStatuses.PENDING
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

  // chainId for now will always be Base as we support Merkl on base only
  const handleMerklOptInAccept = (chainId: SupportedNetworkIds) => {
    if (Number(clientChainId) !== Number(chainId)) {
      setChain({ chain: SDKChainIdToAAChainMap[chainId] })

      return
    }
    dispatch({ type: 'update-merkl-status', payload: UiTransactionStatuses.PENDING })
    merklOptInTransaction().catch((err) => {
      dispatch({ type: 'update-merkl-status', payload: UiTransactionStatuses.FAILED })
      toast.error('Failed to approve Merkl', ERROR_TOAST_CONFIG)
      // eslint-disable-next-line no-console
      console.error('Error approving Merkl', err)
    })
  }

  const handleOptInReject = () => {
    handleOptInOpenClose()
  }

  const stakingV2Earned = initialExternalData.sumrToClaim.aggregatedRewards.stakingV2
  const baseEarnedOnPositions = state.claimableBalances[SupportedNetworkIds.Base] - stakingV2Earned

  return (
    <div className={classNames.claimDelegateClaimStepWrapper}>
      {/* Base network card */}
      <ClaimDelegateNetworkCard
        chainId={SupportedNetworkIds.Base}
        claimableAmount={state.claimableBalances[SupportedNetworkIds.Base] || 0}
        balance={state.walletBalances.base || 0}
        sumrPriceUsd={sumrPriceUsd}
        earnedAdditionalInfo={
          stakingV2Earned > 0 ? (
            <>
              {baseEarnedOnPositions > 0 ? (
                <>
                  {baseEarnedOnPositions.toFixed(2)} SUMR earned on positions
                  <br />
                </>
              ) : null}
              {stakingV2Earned > 0 ? (
                <>{stakingV2Earned.toFixed(2)} SUMR earned on staking</>
              ) : null}
            </>
          ) : null
        }
        walletAddress={resolvedWalletAddress}
        onClaim={() => {
          if (!isOptInOpen && !merklIsAuthorizedOnBase) {
            handleOptInOpenClose()

            return
          }

          handleClaimClick(SupportedNetworkIds.Base)
        }}
        isLoading={
          state.claimStatus === UiTransactionStatuses.PENDING &&
          (state.pendingClaimChainId === SupportedNetworkIds.Base ||
            clientChainId === SupportedNetworkIds.Base)
        }
        isChangingNetwork={isSettingChain && state.pendingClaimChainId === SupportedNetworkIds.Base}
        isChangingNetworkTo={state.pendingClaimChainId}
        authorizedStakingRewardsCallerBase={state.authorizedStakingRewardsCallerBase}
        isOnlyStep
        isOwner={isOwner}
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
            sumrPriceUsd={sumrPriceUsd}
            walletAddress={resolvedWalletAddress}
            onClaim={() => handleClaimClick(item.chainId)}
            isLoading={
              state.claimStatus === UiTransactionStatuses.PENDING &&
              (state.pendingClaimChainId === item.chainId || clientChainId === item.chainId)
            }
            isChangingNetwork={isSettingChain && state.pendingClaimChainId === item.chainId}
            isChangingNetworkTo={state.pendingClaimChainId}
            isOwner={isOwner}
          />
        )
      })}

      <ClaimDelegateFooter canContinue={canContinue} onContinue={handleAccept} />
      {isMobile ? (
        <MobileDrawer isOpen={isOptInOpen} onClose={handleOptInOpenClose} height="auto">
          <ClaimDelegateOptInMerkl
            onAccept={() => handleMerklOptInAccept(SupportedNetworkIds.Base)}
            onReject={handleOptInReject}
            merklStatus={state.merklStatus}
          />
        </MobileDrawer>
      ) : (
        <Modal openModal={isOptInOpen} closeModal={handleOptInOpenClose}>
          <ClaimDelegateOptInMerkl
            onAccept={() => handleMerklOptInAccept(SupportedNetworkIds.Base)}
            onReject={handleOptInReject}
            merklStatus={state.merklStatus}
          />
        </Modal>
      )}
    </div>
  )
}
