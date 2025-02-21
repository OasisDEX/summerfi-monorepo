import { type Dispatch, type FC, useState } from 'react'
import { toast } from 'react-toastify'
import { useChain } from '@account-kit/react'
import { SUMR_CAP, useLocalConfig } from '@summerfi/app-earn-ui'
import { SDKChainId } from '@summerfi/app-types'
import {
  chainIdToSDKNetwork,
  isSupportedHumanNetwork,
  sdkNetworkToHumanNetwork,
} from '@summerfi/app-utils'
import { useParams } from 'next/navigation'

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
import { useUserWallet } from '@/hooks/use-user-wallet'

import { ClaimDelegateBridgeStep } from './ClaimDelegateBridgeSubStep'
import { ClaimDelegateClaimSubStep } from './ClaimDelegateClaimSubStep'
import { ClaimDelegateError } from './ClaimDelegateError'
import { ClaimDelegateFooter } from './ClaimDelegateFooter'

import classNames from './ClaimDelegateClaimStep.module.scss'

const delayPerNetwork = {
  [SDKChainId.BASE]: 4000,
  [SDKChainId.ARBITRUM]: 4000,
  [SDKChainId.MAINNET]: 13000,
}

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
  externalData,
}) => {
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const { userWalletAddress } = useUserWallet()
  const { walletAddress } = useParams()
  const resolvedWalletAddress = (
    Array.isArray(walletAddress) ? walletAddress[0] : walletAddress
  ) as string

  const { checkRisk } = useRiskVerification({
    cookiePrefix: TermsOfServiceCookiePrefix.SUMR_CLAIM_TOKEN,
  })

  const [claimOnChainId, setClaimOnChainId] = useState<
    SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.ARBITRUM
  >(SDKChainId.BASE)

  const { claimSumrTransaction } = useClaimSumrTransaction({
    onSuccess: () => {
      // delay complete status to make sure that in the next step
      // when fetching sumr balance, it will be updated
      setTimeout(() => {
        dispatch({ type: 'update-claim-status', payload: ClaimDelegateTxStatuses.COMPLETED })

        toast.success('Claimed $SUMR tokens successfully', SUCCESS_TOAST_CONFIG)
      }, delayPerNetwork[claimOnChainId])
    },
    onError: () => {
      dispatch({ type: 'update-claim-status', payload: ClaimDelegateTxStatuses.FAILED })

      toast.error('Failed to claim $SUMR tokens', ERROR_TOAST_CONFIG)
    },
  })

  const { setChain } = useChain()
  const { clientChainId } = useClientChainId()
  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  const handleBack = () => {
    dispatch({ type: 'update-step', payload: ClaimDelegateSteps.TERMS })
  }

  const handleAccept = async () => {
    if (state.claimStatus === ClaimDelegateTxStatuses.COMPLETED) {
      dispatch({ type: 'update-step', payload: ClaimDelegateSteps.DELEGATE })

      return
    }

    if (clientChainId !== claimOnChainId) {
      setChain({ chain: SDKChainIdToAAChainMap[claimOnChainId] })

      return
    }

    dispatch({ type: 'update-claim-status', payload: ClaimDelegateTxStatuses.PENDING })

    const risk = await checkRisk()

    if (risk.isRisky) {
      return
    }

    await claimSumrTransaction().catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error claiming $SUMR:', err)
    })
  }

  const sumrToClaim =
    externalData.sumrToClaim.claimableAggregatedRewards.perChain[claimOnChainId] ?? 0
  const hideButtonArrow = state.claimStatus === ClaimDelegateTxStatuses.PENDING

  const hubClaimItem = claimItems.find((item) => item.chainId === SDKChainId.BASE)
  const satelliteClaimItems = claimItems.filter((item) => item.chainId !== SDKChainId.BASE)

  // Check for SUMR on satellite chains (non-Base)
  const hasSumrOnSatelliteChains = Boolean(
    Number(externalData.sumrBalances.mainnet) > 0 ||
      Number(externalData.sumrBalances.arbitrum) > 0 ||
      externalData.sumrToClaim.aggregatedRewards.perChain[SDKChainId.MAINNET] > 0 || // Mainnet
      externalData.sumrToClaim.aggregatedRewards.perChain[SDKChainId.ARBITRUM] > 0, // Arbitrum
  )
  const hasSumrOnHubChain =
    Number(externalData.sumrBalances.base) > 0 ||
    externalData.sumrToClaim.aggregatedRewards.perChain[SDKChainId.BASE] > 0

  const humanNetwork = sdkNetworkToHumanNetwork(chainIdToSDKNetwork(claimOnChainId))

  if (!isSupportedHumanNetwork(humanNetwork)) {
    return (
      <div className={classNames.claimDelegateClaimStepWrapper}>
        <ClaimDelegateError error="Unsupported network" onBack={handleBack} />
      </div>
    )
  }

  const disableBridgeButton =
    (externalData.sumrToClaim.aggregatedRewards.perChain[claimOnChainId] === 0 &&
      Number(externalData.sumrBalances[humanNetwork]) === 0) ||
    claimOnChainId === SDKChainId.BASE

  return (
    <div className={classNames.claimDelegateClaimStepWrapper}>
      {state.claimStatus === ClaimDelegateTxStatuses.COMPLETED ? (
        <ClaimDelegateBridgeStep
          externalData={externalData}
          claimOnChainId={claimOnChainId}
          setClaimOnChainId={setClaimOnChainId}
          satelliteClaimItems={satelliteClaimItems}
          hasSumrOnSatelliteChains={hasSumrOnSatelliteChains}
        />
      ) : (
        <ClaimDelegateClaimSubStep
          hubClaimItem={hubClaimItem}
          satelliteClaimItems={satelliteClaimItems}
          claimOnChainId={claimOnChainId}
          setClaimOnChainId={setClaimOnChainId}
          externalData={externalData}
          estimatedSumrPrice={estimatedSumrPrice}
        />
      )}
      <ClaimDelegateFooter
        claimStatus={state.claimStatus}
        hasSumrOnSatelliteChains={hasSumrOnSatelliteChains}
        hasSumrOnHubChain={hasSumrOnHubChain}
        hideButtonArrow={hideButtonArrow}
        sumrToClaim={sumrToClaim}
        claimOnChainId={claimOnChainId}
        clientChainId={clientChainId}
        disableBridgeButton={disableBridgeButton}
        resolvedWalletAddress={resolvedWalletAddress}
        userWalletAddress={userWalletAddress}
        onBack={handleBack}
        onAccept={handleAccept}
      />
    </div>
  )
}
