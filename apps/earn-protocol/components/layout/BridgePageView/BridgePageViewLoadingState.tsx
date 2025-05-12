'use client'

import { type FC } from 'react'
import { Button, Card, SkeletonLine } from '@summerfi/app-earn-ui'

import BridgeFormTitle from '@/features/bridge/components/BridgeFormTitle/BridgeFormTitle'
import { Spacer } from '@/features/bridge/components/Spacer/Spacer'

import classNames from './BridgePageViewLoadingState.module.css'

interface BridgePageViewLoadingStateProps {}

function SimpleBridgeSkeleton() {
  return (
    <Card variant="cardSecondary" className={classNames.skeletonCard}>
      <div className={classNames.skeletonTitleWrapper}>
        <BridgeFormTitle />
      </div>
      <div className={classNames.skeletonTitleSpacer} />

      <div className={classNames.skeletonContent}>
        <SkeletonLine height={100} radius="var(--radius-roundish)" />
        <Spacer />
        <SkeletonLine height={120} radius="var(--radius-roundish)" />
        <SkeletonLine height={200} radius="var(--radius-roundish)" />

        <div className={classNames.skeletonCta}>
          <Button variant="primaryLarge" disabled>
            Bridge
          </Button>
        </div>
      </div>
    </Card>
  )
}

export const BridgePageViewLoadingState: FC<BridgePageViewLoadingStateProps> = () => {
  return (
    <div className={classNames.bridgePageViewLoadingStateWrapper}>
      <SimpleBridgeSkeleton />
    </div>
  )
}
