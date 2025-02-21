import { type Dispatch, type FC, useState } from 'react'
import { toast } from 'react-toastify'
import { useChain } from '@account-kit/react'
import { SUMR_CAP, TabBar, useLocalConfig } from '@summerfi/app-earn-ui'
import { SDKChainId } from '@summerfi/app-types'
import {
  chainIdToSDKNetwork,
  isSupportedHumanNetwork,
  sdkNetworkToHumanNetwork,
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
import { useUserWallet } from '@/hooks/use-user-wallet'

import { ClaimDelegateBridgeStep } from './ClaimDelegateBridgeSubStep'
import { ClaimDelegateClaimSubStep } from './ClaimDelegateClaimSubStep'
import { ClaimDelegateError } from './ClaimDelegateError'

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
  externalData: initialExternalData,
}) => {
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const { userWalletAddress } = useUserWallet()
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
  const [claimOnChainId, setClaimOnChainId] = useState<
    SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.ARBITRUM
  >(SDKChainId.BASE)

  const { claimSumrTransaction } = useClaimSumrTransaction({
    onSuccess: () => {
      setTimeout(() => {
        // Zero out the claimed amount and update balances
        const humanNetwork = sdkNetworkToHumanNetwork(chainIdToSDKNetwork(claimOnChainId))

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
                [claimOnChainId]: 0,
              },
            },
          },
          sumrBalances: {
            ...prevData.sumrBalances,
            [humanNetwork]:
              (Number(prevData.sumrBalances[humanNetwork]) || 0) +
              (prevData.sumrToClaim.claimableAggregatedRewards.perChain[claimOnChainId] || 0),
          },
        }))

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

  const handleSkip = () => {
    dispatch({ type: 'update-step', payload: ClaimDelegateSteps.DELEGATE })
  }

  const hubClaimItem = claimItems.find((item) => item.chainId === SDKChainId.BASE)
  const satelliteClaimItems = claimItems.filter((item) => item.chainId !== SDKChainId.BASE)

  // Check for SUMR on satellite chains (non-Base)
  const hasSumrOnSatelliteChains = Boolean(
    Number(externalData.sumrBalances.mainnet) > 0 ||
      Number(externalData.sumrBalances.arbitrum) > 0 ||
      externalData.sumrToClaim.aggregatedRewards.perChain[SDKChainId.MAINNET] > 0 || // Mainnet
      externalData.sumrToClaim.aggregatedRewards.perChain[SDKChainId.ARBITRUM] > 0, // Arbitrum
  )

  const tabs = [
    {
      id: 'claim',
      label: 'Claim',
      content: (
        <ClaimDelegateClaimSubStep
          hubClaimItem={hubClaimItem}
          satelliteClaimItems={satelliteClaimItems}
          claimOnChainId={claimOnChainId}
          setClaimOnChainId={setClaimOnChainId}
          externalData={externalData}
          estimatedSumrPrice={estimatedSumrPrice}
          claimStatus={state.claimStatus}
          clientChainId={clientChainId}
          resolvedWalletAddress={resolvedWalletAddress}
          userWalletAddress={userWalletAddress}
          hasReturnedToClaimStep={hasReturnedToClaimStep}
          onBack={handleBack}
          onAccept={handleAccept}
          onSkip={handleSkip}
        />
      ),
    },
    {
      id: 'bridge',
      label: 'Bridge',
      content: (
        <ClaimDelegateBridgeStep
          externalData={externalData}
          claimOnChainId={claimOnChainId}
          setClaimOnChainId={setClaimOnChainId}
          satelliteClaimItems={satelliteClaimItems}
          hasSumrOnSatelliteChains={hasSumrOnSatelliteChains}
          resolvedWalletAddress={resolvedWalletAddress}
          hasReturnedToClaimStep={hasReturnedToClaimStep}
          onBack={handleBack}
          onSkip={handleSkip}
        />
      ),
    },
  ]

  const defaultTabIndex = state.claimStatus === ClaimDelegateTxStatuses.COMPLETED ? 1 : 0

  if (!isSupportedHumanNetwork(sdkNetworkToHumanNetwork(chainIdToSDKNetwork(claimOnChainId)))) {
    return (
      <div className={classNames.claimDelegateClaimStepWrapper}>
        <ClaimDelegateError error="Unsupported network" onBack={handleBack} />
      </div>
    )
  }

  return (
    <div className={classNames.claimDelegateClaimStepWrapper}>
      <TabBar
        tabs={tabs}
        defaultIndex={defaultTabIndex}
        textVariant="p3semi"
        tabHeadersStyle={{ borderBottom: '1px solid var(--earn-protocol-neutral-80)' }}
      />
    </div>
  )
}
