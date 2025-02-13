'use client'

import { type FC } from 'react'
import { Button, Card, SkeletonLine } from '@summerfi/app-earn-ui'

import BridgeFormTitle from '@/features/bridge/components/BridgeFormTitle/BridgeFormTitle'
import { Spacer } from '@/features/bridge/components/Spacer/Spacer'

import classNames from './BridgePageView.module.scss'

interface BridgePageViewLoadingStateProps {
  walletAddress: string
}

function SimpleBridgeSkeleton() {
  return (
    <Card
      variant="cardSecondary"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '455px',
      }}
    >
      <div className={classNames.skeletonTitleWrapper}>
        <BridgeFormTitle />
      </div>
      <div className={classNames.skeletonTitleSpacer} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: 'var(--general-space-24)',
          gap: 'var(--general-space-24)',
        }}
      >
        <SkeletonLine height={100} radius="var(--radius-roundish)" />
        <Spacer />
        <SkeletonLine height={220} radius="var(--radius-roundish)" />

        <div className={classNames.skeletonCta}>
          <Button variant="primaryLarge" onClick={() => {}} disabled>
            Bridge
          </Button>
          <Button variant="secondaryLarge" onClick={() => {}} disabled>
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  )
}

export const BridgePageViewLoadingState: FC<BridgePageViewLoadingStateProps> = ({
  walletAddress,
}) => {
  return (
    <div className={classNames.bridgePageViewLoadingStateWrapper}>
      <SimpleBridgeSkeleton />
    </div>
  )
}
