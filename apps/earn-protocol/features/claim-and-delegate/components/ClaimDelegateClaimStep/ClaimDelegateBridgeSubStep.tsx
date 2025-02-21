import { type FC } from 'react'
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

import { ClaimDelegateToBridge } from '@/features/claim-and-delegate/components/ClaimDelegateClaimStep/ClaimDelegateToBridge'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'

import classNames from './ClaimDelegateClaimStep.module.scss'

interface ClaimDelegateBridgeStepProps {
  externalData: ClaimDelegateExternalData
  claimOnChainId: SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.ARBITRUM
  setClaimOnChainId: (chainId: SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.ARBITRUM) => void
  satelliteClaimItems: { chainId: SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.ARBITRUM }[]
  hasSumrOnSatelliteChains: boolean
  resolvedWalletAddress: string
  hasReturnedToClaimStep: boolean
  onBack: () => void
  onSkip: () => void
}

export const ClaimDelegateBridgeStep: FC<ClaimDelegateBridgeStepProps> = ({
  externalData,
  claimOnChainId,
  setClaimOnChainId,
  satelliteClaimItems,
  hasSumrOnSatelliteChains,
  resolvedWalletAddress,
  hasReturnedToClaimStep,
  onBack,
  onSkip,
}) => {
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  const disableBridgeButton = !hasSumrOnSatelliteChains || claimOnChainId === SDKChainId.BASE

  return (
    <>
      <div className={classNames.bridgeWrapper}>
        <Text variant="p3semi" as="p">
          Bridge SUMR to Base
        </Text>
      </div>
      <div>
        {hasSumrOnSatelliteChains ? (
          satelliteClaimItems.map((item) => {
            const network = sdkNetworkToHumanNetwork(chainIdToSDKNetwork(item.chainId))

            if (!isSupportedHumanNetwork(network)) return null

            const balance = externalData.sumrBalances[network]

            return (
              <ClaimDelegateToBridge
                key={item.chainId}
                {...item}
                balance={formatCryptoBalance(Number(balance))}
                balanceInUSD={formatFiatBalance(Number(balance) * estimatedSumrPrice)}
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
      </div>

      <div className={classNames.footerWrapper}>
        <div className={classNames.mainActionsGroup}>
          <Button variant="secondaryMedium" onClick={onBack}>
            <Text variant="p3semi" as="p">
              Back
            </Text>
          </Button>

          {hasSumrOnSatelliteChains && (
            <Link
              href={`/bridge/${resolvedWalletAddress}?via=claim&source_chain=${claimOnChainId}`}
            >
              <Button variant="primaryMedium" disabled={disableBridgeButton}>
                Bridge
              </Button>
            </Link>
          )}
        </div>

        <Button variant="textMedium" onClick={onSkip}>
          <WithArrow variant="p3semi" as="p">
            {hasReturnedToClaimStep ? 'Continue' : 'Skip'}
          </WithArrow>
        </Button>
      </div>
    </>
  )
}
