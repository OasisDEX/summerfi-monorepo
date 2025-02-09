import { type FC } from 'react'
import { Card, Icon, Text } from '@summerfi/app-earn-ui'
import { SDKChainId } from '@summerfi/app-types'
import clsx from 'clsx'

import { networkSDKChainIdIconMap } from '@/constants/network-id-to-icon'

import classNames from './ClaimDelegateClaimStep.module.scss'

const networkLabels = {
  [SDKChainId.BASE]: 'BASE Network',
  [SDKChainId.OPTIMISM]: 'OPTIMISM Network',
  [SDKChainId.ARBITRUM]: 'ARBITRUM Network',
  [SDKChainId.MAINNET]: 'MAINNET Network',
}

interface ClaimDelegateToClaimProps {
  earned: string
  earnedInUSD: string
  chainId: SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.ARBITRUM
  isActive: boolean
  onClick: () => void
}

export const ClaimDelegateToClaim: FC<ClaimDelegateToClaimProps> = ({
  earned,
  earnedInUSD,
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
      <Text as="p" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
        You have earned
      </Text>
      <div className={classNames.valueWithIcon}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--general-space-4)',
            position: 'relative',
          }}
        >
          <Icon tokenName="SUMR" size={36} />
          <div style={{ position: 'absolute', top: '-4px', right: '-4px' }}>
            {networkSDKChainIdIconMap(chainId)}
          </div>
        </div>
        <Text as="h2" variant="h2">
          {earned}
        </Text>
      </div>
      <Text as="p" variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
        ${earnedInUSD}
      </Text>
      <Text as="p" variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
        {networkLabels[chainId]}
      </Text>
    </Card>
  )
}
