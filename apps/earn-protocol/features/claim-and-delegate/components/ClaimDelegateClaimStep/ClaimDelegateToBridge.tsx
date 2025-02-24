import { type FC } from 'react'
import { Button, Card, Icon, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type SDKChainId } from '@summerfi/app-types'
import { humanReadableChainToLabelMap } from '@summerfi/app-utils'
import clsx from 'clsx'
import Link from 'next/link'

import { networkSDKChainIdIconMap } from '@/constants/network-id-to-icon'

import classNames from './ClaimDelegateClaimStep.module.scss'

interface ClaimDelegateToBridgeProps {
  balance: string
  balanceInUSD: string
  chainId: SDKChainId.BASE | SDKChainId.MAINNET | SDKChainId.ARBITRUM
  walletAddress: string
}

export const ClaimDelegateToBridge: FC<ClaimDelegateToBridgeProps> = ({
  balance,
  balanceInUSD,
  chainId,
  walletAddress,
}) => {
  return (
    <Card className={classNames.cardWrapper}>
      <div className={clsx(classNames.tagWrapper, classNames.bridge)}>
        <Text as="p" variant="p4semi" className={classNames.tabLabel}>
          Ready to bridge
        </Text>
      </div>
      <Text as="p" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
        On {humanReadableChainToLabelMap[chainId]}
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
      <Link href={`/bridge/${walletAddress}?via=claim&source_chain=${chainId}`}>
        <Button variant="neutralSmall">
          <WithArrow
            variant="p4semi"
            as="p"
            reserveSpace
            style={{ color: 'var(--earn-protocol-secondary-100)' }}
          >
            Bridge
          </WithArrow>
        </Button>
      </Link>
    </Card>
  )
}
