import { type FC } from 'react'
import { Card, Icon, SUMR_CAP, Text, useLocalConfig } from '@summerfi/app-earn-ui'
import { type SDKChainId } from '@summerfi/app-types'
import {
  chainIdToSDKNetwork,
  formatCryptoBalance,
  formatFiatBalance,
  isSupportedHumanNetwork,
  sdkNetworkToHumanNetwork,
} from '@summerfi/app-utils'

import { ClaimDelegateToBridge } from '@/features/claim-and-delegate/components/ClaimDelegateClaimStep/ClaimDelegateToBridge'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'

import classNames from './ClaimDelegateClaimStep.module.scss'

interface ClaimDelegateBridgeStepProps {
  externalData: ClaimDelegateExternalData
  claimOnChainId: SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.ARBITRUM
  setClaimOnChainId: (chainId: SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.ARBITRUM) => void
  satelliteClaimItems: { chainId: SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.ARBITRUM }[]
  hasSumrOnSatelliteChains: boolean
}

export const ClaimDelegateBridgeStep: FC<ClaimDelegateBridgeStepProps> = ({
  externalData,
  claimOnChainId,
  setClaimOnChainId,
  satelliteClaimItems,
  hasSumrOnSatelliteChains,
}) => {
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  return (
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
  )
}
