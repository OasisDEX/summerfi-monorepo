import { type FC } from 'react'
import { Card, Icon, Text } from '@summerfi/app-earn-ui'
import { type SDKChainId } from '@summerfi/app-types'
import { humanReadableChainToLabelMap } from '@summerfi/app-utils'
import clsx from 'clsx'

import { networkSDKChainIdIconMap } from '@/constants/network-id-to-icon'

import classNames from './ClaimDelegateClaimStep.module.scss'

interface ClaimDelegateToBridgeProps {
  balance: string
  balanceInUSD: string
  chainId: SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.ARBITRUM
  isActive: boolean
  onClick: () => void
}

export const ClaimDelegateToBridge: FC<ClaimDelegateToBridgeProps> = ({
  balance,
  balanceInUSD,
  chainId,
  isActive,
  onClick,
}) => {
  return (
    <Card
      className={clsx(classNames.cardWrapper, {
        [classNames.cardWrapperActive]: isActive,
      })}
      onClick={onClick}
    >
      {isActive && (
        <div className={classNames.selectedWrapper}>
          <Text as="p" variant="p4semi" className={classNames.selectedLabel}>
            Selected
          </Text>
          <div className={classNames.checkmarkWrapper}>
            <Icon iconName="checkmark" size={12} />
          </div>
        </div>
      )}
      <Text as="p" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
        Available to bridge
      </Text>
      <div className={classNames.valueWithIcon}>
        <div className={classNames.container}>
          <Icon tokenName="SUMR" size={36} />
          <div style={{ position: 'absolute', top: '-4px', right: '-4px' }}>
            {networkSDKChainIdIconMap(chainId)}
          </div>
        </div>
        <div className={classNames.valueWrapper}>
          <Text as="h2" variant="h2">
            {balance}
          </Text>
          <Text as="p" variant="p2semi" className={classNames.usdValue}>
            ${balanceInUSD}
          </Text>
        </div>
      </div>
      <Text as="p" variant="p3semi" className={classNames.chainLabel}>
        {humanReadableChainToLabelMap[chainId]}
      </Text>
    </Card>
  )
}
