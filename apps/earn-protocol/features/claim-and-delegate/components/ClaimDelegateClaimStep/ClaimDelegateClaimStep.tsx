import { type Dispatch, type FC, useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useChain } from '@account-kit/react'
import { ErrorMessage, SUMR_CAP, useLocalConfig } from '@summerfi/app-earn-ui'
import { SDKChainId } from '@summerfi/app-types'
import {
  chainIdToSDKNetwork,
  isSupportedHumanNetwork,
  sdkNetworkToHumanNetwork,
  sdkNetworkToHumanNetworkStrict,
} from '@summerfi/app-utils'
import { useParams, useSearchParams } from 'next/navigation'

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

import classNames from './ClaimDelegateClaimStep.module.scss'

const delayPerNetwork = {
  [SDKChainId.BASE]: 4000,
  [SDKChainId.ARBITRUM]: 4000,
  [SDKChainId.MAINNET]: 13000,
} as const

const claimItems: {
  chainId: SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.ARBITRUM
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

  const [externalData, setExternalData] = useState(initialExternalData)

  const { setChain, isSettingChain } = useChain()
  const { clientChainId } = useClientChainId() as {
    clientChainId: SDKChainId.BASE | SDKChainId.ARBITRUM | SDKChainId.MAINNET
  }

  const handleBack = () => {
    dispatch({ type: 'update-step', payload: ClaimDelegateSteps.TERMS })
  }

  const { claimSumrTransaction } = useClaimSumrTransaction({
    onSuccess: () => {
      setTimeout(() => {
        // Zero out the claimed amount and update balances
        const humanNetwork = sdkNetworkToHumanNetwork(chainIdToSDKNetwork(clientChainId))

        if (!isSupportedHumanNetwork(humanNetwork)) {
          throw new Error(`Unsupported network: ${humanNetwork}`)
        }

        setExternalData((prevData) => ({
          ...prevData,
          sumrToClaim: {
            ...prevData.sumrToClaim,
            claimableAggregatedRewards: {
              ...prevData.sumrToClaim.claimableAggregatedRewards,
              perChain: {
                ...prevData.sumrToClaim.claimableAggregatedRewards.perChain,
                [clientChainId]: 0,
              },
            },
          },
          sumrBalances: {
            ...prevData.sumrBalances,
            [humanNetwork]:
              (Number(prevData.sumrBalances[humanNetwork]) || 0) +
              (prevData.sumrToClaim.claimableAggregatedRewards.perChain[clientChainId] || 0),
          },
        }))

        dispatch({ type: 'update-claim-status', payload: ClaimDelegateTxStatuses.COMPLETED })
        toast.success('Claimed $SUMR tokens successfully', SUCCESS_TOAST_CONFIG)
      }, delayPerNetwork[clientChainId])
    },
    onError: () => {
      dispatch({ type: 'update-claim-status', payload: ClaimDelegateTxStatuses.FAILED })
      toast.error('Failed to claim $SUMR tokens', ERROR_TOAST_CONFIG)
    },
  })

  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  const handleClaim = useCallback(async () => {
    dispatch({ type: 'update-claim-status', payload: ClaimDelegateTxStatuses.PENDING })

    const risk = await checkRisk()

    if (risk.isRisky) {
      return
    }

    await claimSumrTransaction().catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error claiming $SUMR:', err)
    })
  }, [dispatch, checkRisk, claimSumrTransaction])

  // Watch for chain changes and trigger claim if pending
  useEffect(() => {
    if (
      state.pendingClaimChainId &&
      clientChainId === state.pendingClaimChainId &&
      !isSettingChain
    ) {
      handleClaim()
      // Clear pending claim
      dispatch({ type: 'set-pending-claim', payload: undefined })
    }
  }, [clientChainId, state.pendingClaimChainId, isSettingChain, handleClaim, dispatch])

  const hasClaimedAtLeastOneChain = state.claimStatus === ClaimDelegateTxStatuses.COMPLETED
  const canContinue = hasClaimedAtLeastOneChain || hasReturnedToClaimStep

  const handleAccept = () => {
    dispatch({ type: 'update-step', payload: ClaimDelegateSteps.DELEGATE })
  }

  const handleClaimClick = (
    chainId: SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.ARBITRUM,
  ) => {
    if (clientChainId !== chainId) {
      dispatch({ type: 'set-pending-claim', payload: chainId })
      setChain({ chain: SDKChainIdToAAChainMap[chainId] })

      return
    }
    handleClaim()
  }

  const satelliteClaimItems = claimItems.filter((item) => item.chainId !== SDKChainId.BASE)

  const hasClaimableBalance = Object.values(
    externalData.sumrToClaim.claimableAggregatedRewards.perChain,
  ).some((amount) => amount > 0)

  const hasBridgeableBalance = satelliteClaimItems.some((item) => {
    try {
      const humanNetwork = sdkNetworkToHumanNetworkStrict(chainIdToSDKNetwork(item.chainId))

      return Number(externalData.sumrBalances[humanNetwork]) > 0
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error checking bridgeable balance:', error)

      return false
    }
  })

  if (!hasClaimableBalance && !hasBridgeableBalance) {
    return <ClaimDelegateNoBalances onContinue={handleAccept} />
  }

  if (!isSupportedHumanNetwork(sdkNetworkToHumanNetwork(chainIdToSDKNetwork(clientChainId)))) {
    return (
      <div className={classNames.claimDelegateClaimStepWrapper}>
        <ClaimDelegateError error="Unsupported network" onBack={handleBack} />
      </div>
    )
  }

  return (
    <div className={classNames.claimDelegateClaimStepWrapper}>
      {/* Base network card */}
      <ClaimDelegateNetworkCard
        chainId={SDKChainId.BASE}
        claimableAmount={
          externalData.sumrToClaim.claimableAggregatedRewards.perChain[SDKChainId.BASE] ?? 0
        }
        balance={Number(externalData.sumrBalances.base) || 0}
        estimatedSumrPrice={estimatedSumrPrice}
        walletAddress={resolvedWalletAddress}
        onClaim={() => handleClaimClick(SDKChainId.BASE)}
        isLoading={
          (state.claimStatus === ClaimDelegateTxStatuses.PENDING || isSettingChain) &&
          (state.pendingClaimChainId === SDKChainId.BASE || clientChainId === SDKChainId.BASE)
        }
      />

      {/* Satellite network cards */}
      {satelliteClaimItems.map((item) => {
        const network = sdkNetworkToHumanNetwork(chainIdToSDKNetwork(item.chainId))

        if (!isSupportedHumanNetwork(network)) return null

        const claimableAmount =
          externalData.sumrToClaim.claimableAggregatedRewards.perChain[item.chainId] ?? 0

        return (
          <ClaimDelegateNetworkCard
            key={item.chainId}
            chainId={item.chainId}
            claimableAmount={claimableAmount}
            balance={Number(externalData.sumrBalances[network]) || 0}
            estimatedSumrPrice={estimatedSumrPrice}
            walletAddress={resolvedWalletAddress}
            onClaim={() => handleClaimClick(item.chainId)}
            isLoading={
              (state.claimStatus === ClaimDelegateTxStatuses.PENDING || isSettingChain) &&
              (state.pendingClaimChainId === item.chainId || clientChainId === item.chainId)
            }
          />
        )
      })}

      <div className={classNames.errorMessageWrapper}>
        <ErrorMessage
          variant="general"
          iconName="bridge"
          error="You'll need to bridge your SUMR to Base before you can stake it"
        />
      </div>

      <ClaimDelegateFooter
        canContinue={canContinue}
        onBack={handleBack}
        onContinue={handleAccept}
      />
    </div>
  )
}
