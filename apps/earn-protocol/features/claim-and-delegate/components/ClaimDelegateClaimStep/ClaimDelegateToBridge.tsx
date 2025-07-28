import { type FC } from 'react'
import { Alert, Button, Card, Icon, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type SupportedNetworkIds } from '@summerfi/app-types'
import { humanReadableChainToLabelMap } from '@summerfi/app-utils'
import clsx from 'clsx'
import Link from 'next/link'

import { networkSDKChainIdIconMap } from '@/constants/network-id-to-icon'

import classNames from './ClaimDelegateClaimStep.module.css'

interface ClaimDelegateToBridgeProps {
  balance: string
  balanceInUSD: string
  chainId: SupportedNetworkIds
  walletAddress: string
}

export const ClaimDelegateToBridge: FC<ClaimDelegateToBridgeProps> = ({
  balance,
  chainId,
  walletAddress,
}) => {
  return (
    <Card className={classNames.cardWrapper}>
      <div className={clsx(classNames.tagWrapper, classNames.bridge)}>
        <Text as="p" variant="p4semi">
          Ready to bridge
        </Text>
      </div>
      <div className={classNames.networkWrapper}>
        {networkSDKChainIdIconMap(chainId)}
        <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
          {humanReadableChainToLabelMap[chainId]}
        </Text>
      </div>
      <div className={classNames.valueWithIcon}>
        <div className={classNames.container}>
          <Icon tokenName="SUMR" size={36} />
        </div>
        <div className={classNames.valueWrapper}>
          <Text as="h2" variant="h2">
            {balance}
          </Text>
        </div>
      </div>
      <div className={classNames.walletBalanceWrapper}>
        <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
          {balance} in wallet
        </Text>
      </div>
      <div className={classNames.ctaWrapper}>
        <Link href={`/bridge/${walletAddress}?via=claim&source_chain=${chainId}`}>
          <Button variant="neutralSmall">
            <WithArrow
              variant="p4semi"
              as="p"
              reserveSpace
              style={{ color: 'var(--earn-protocol-secondary-100)' }}
            >
              Bridge 2/2
            </WithArrow>
          </Button>
        </Link>
      </div>
      <div className={classNames.alertWrapper}>
        <Alert
          variant="general"
          iconName="bridge"
          error={
            <div className={classNames.alertContent}>
              <Text variant="p3semi" as="p">
                Bridge your SUMR to Base to stake it
              </Text>

              <Link
                target="_blank"
                href="https://docs.summer.fi/lazy-summer-protocol/governance/cross-chain-governance"
              >
                <Button variant="unstyled" style={{ whiteSpace: 'nowrap' }}>
                  <WithArrow variant="p4semi" as="p" reserveSpace>
                    Here&apos;s why
                  </WithArrow>
                </Button>
              </Link>
            </div>
          }
        />
      </div>
    </Card>
  )
}
