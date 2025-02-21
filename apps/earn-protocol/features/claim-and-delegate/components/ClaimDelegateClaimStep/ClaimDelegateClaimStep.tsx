import { type Dispatch, type FC, useState } from 'react'
import { toast } from 'react-toastify'
import { useChain } from '@account-kit/react'
import {
  Button,
  Card,
  Icon,
  SUMR_CAP,
  Text,
  useLocalConfig,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { SDKChainId } from '@summerfi/app-types'
import {
  chainIdToSDKNetwork,
  formatCryptoBalance,
  formatFiatBalance,
  isSupportedHumanNetwork,
  sdkNetworkToHumanNetwork,
} from '@summerfi/app-utils'
import Link from 'next/link'
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

import { ClaimDelegateError } from './ClaimDelegateError'
import { ClaimDelegateToBridge } from './ClaimDelegateToBridge'
import { ClaimDelegateToClaim } from './ClaimDelegateToClaim'

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
    externalData.sumrToClaim.aggregatedRewards.perChain[claimOnChainId] === 0 &&
    Number(externalData.sumrBalances[humanNetwork]) === 0

  return (
    <div className={classNames.claimDelegateClaimStepWrapper}>
      {state.claimStatus === ClaimDelegateTxStatuses.COMPLETED ? (
        // Show bridge components when claimed
        <>
          <div className={classNames.bridgeWrapper}>
            <Text as="p" variant="p3semi">
              Bridge SUMR to Base
            </Text>
          </div>
          {hasSumrOnSatelliteChains ? (
            satelliteClaimItems.map((item) => {
              const network = sdkNetworkToHumanNetwork(chainIdToSDKNetwork(item.chainId))

              if (!isSupportedHumanNetwork(network)) return null

              const balance = externalData.sumrBalances[network]
              const claimableRewards =
                externalData.sumrToClaim.claimableAggregatedRewards.perChain[item.chainId] ?? 0
              const total = Number(balance) + claimableRewards

              return (
                <ClaimDelegateToBridge
                  key={item.chainId}
                  {...item}
                  balance={formatCryptoBalance(total)}
                  balanceInUSD={formatFiatBalance(total * estimatedSumrPrice)}
                  isActive={claimOnChainId === item.chainId}
                  onClick={() => setClaimOnChainId(item.chainId)}
                />
              )
            })
          ) : (
            <Card
              className={classNames.cardWrapper}
              style={{ marginBottom: 'var(--general-space-24)' }}
            >
              <Icon iconName="info" size={24} />
              <Text variant="p3semi" as="p">
                No SUMR to bridge
              </Text>
            </Card>
          )}
        </>
      ) : (
        // Show claim components when not yet claimed
        <>
          {hubClaimItem && (
            <ClaimDelegateToClaim
              {...hubClaimItem}
              earned={formatCryptoBalance(
                externalData.sumrToClaim.claimableAggregatedRewards.perChain[
                  hubClaimItem.chainId
                ] ?? 0,
              )}
              earnedInUSD={formatFiatBalance(
                Number(
                  externalData.sumrToClaim.claimableAggregatedRewards.perChain[
                    hubClaimItem.chainId
                  ] ?? 0,
                ) * estimatedSumrPrice,
              )}
              isActive={claimOnChainId === hubClaimItem.chainId}
              onClick={() => setClaimOnChainId(hubClaimItem.chainId)}
            />
          )}
          {satelliteClaimItems.map((item) => (
            <ClaimDelegateToClaim
              key={item.chainId}
              {...item}
              earned={formatCryptoBalance(
                externalData.sumrToClaim.claimableAggregatedRewards.perChain[item.chainId] ?? 0,
              )}
              earnedInUSD={formatFiatBalance(
                Number(
                  externalData.sumrToClaim.claimableAggregatedRewards.perChain[item.chainId] ?? 0,
                ) * estimatedSumrPrice,
              )}
              isActive={claimOnChainId === item.chainId}
              onClick={() => setClaimOnChainId(item.chainId)}
            />
          ))}
        </>
      )}
      <div className={classNames.footerWrapper}>
        <Button variant="secondaryMedium" onClick={handleBack}>
          <Text variant="p3semi" as="p">
            Back
          </Text>
        </Button>
        {(state.claimStatus !== ClaimDelegateTxStatuses.COMPLETED ||
          (!hasSumrOnSatelliteChains &&
            state.claimStatus === ClaimDelegateTxStatuses.COMPLETED)) && (
          <Button
            variant="primarySmall"
            style={{
              paddingRight: hideButtonArrow ? 'var(--general-space-24)' : 'var(--general-space-32)',
            }}
            onClick={handleAccept}
            disabled={
              state.claimStatus === ClaimDelegateTxStatuses.PENDING ||
              (sumrToClaim === 0 && state.claimStatus !== ClaimDelegateTxStatuses.COMPLETED) ||
              (!hasSumrOnHubChain && state.claimStatus === ClaimDelegateTxStatuses.COMPLETED) ||
              userWalletAddress?.toLowerCase() !== resolvedWalletAddress.toLowerCase()
            }
          >
            <WithArrow
              style={{ color: 'var(--earn-protocol-secondary-100)' }}
              variant="p3semi"
              as="p"
              hideArrow={hideButtonArrow}
              isLoading={state.claimStatus === ClaimDelegateTxStatuses.PENDING}
            >
              {state.claimStatus === ClaimDelegateTxStatuses.PENDING && 'Claiming...'}
              {state.claimStatus === ClaimDelegateTxStatuses.COMPLETED && 'Continue'}
              {state.claimStatus === ClaimDelegateTxStatuses.COMPLETED &&
                hasSumrOnSatelliteChains &&
                'Bridge'}
              {state.claimStatus === ClaimDelegateTxStatuses.FAILED &&
                (claimOnChainId !== clientChainId ? 'Switch Network' : 'Retry')}
              {state.claimStatus === undefined &&
                (claimOnChainId !== clientChainId ? 'Switch Network' : 'Claim')}
            </WithArrow>
          </Button>
        )}
        {hasSumrOnSatelliteChains && state.claimStatus === ClaimDelegateTxStatuses.COMPLETED && (
          <div className={classNames.bridgeButtonWrapper}>
            <Button variant="secondaryMedium" onClick={handleAccept}>
              <Text variant="p3semi" as="p">
                <WithArrow
                  variant="p3semi"
                  as="span"
                  reserveSpace
                  style={{ color: 'var(--earn-protocol-secondary-60)' }}
                >
                  Skip
                </WithArrow>
              </Text>
            </Button>
            <Link
              href={`/bridge/${resolvedWalletAddress}?via=claim&source_chain=${claimOnChainId}`}
            >
              <Button variant="primaryMedium" disabled={disableBridgeButton}>
                Bridge
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
