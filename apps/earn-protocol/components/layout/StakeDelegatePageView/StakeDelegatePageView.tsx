'use client'
import { type FC, useReducer } from 'react'
import { Card, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { ClaimDelegateStakeDelegateStep } from '@/features/claim-and-delegate/components/ClaimDelegateStakeDelegateStep/ClaimDelegateStakeDelegateStep'
import { claimDelegateReducer, claimDelegateState } from '@/features/claim-and-delegate/state'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { PortfolioTabs } from '@/features/portfolio/types'

import classNames from './StakeDelegatePageView.module.scss'

interface StakeDelegatePageViewProps {
  walletAddress: string
  externalData: ClaimDelegateExternalData
}

export const StakeDelegatePageView: FC<StakeDelegatePageViewProps> = ({
  walletAddress,
  externalData,
}) => {
  const [state, dispatch] = useReducer(claimDelegateReducer, {
    ...claimDelegateState,
    delegatee: externalData.sumrStakeDelegate.delegatedTo,
    walletAddress,
  })

  return (
    <div className={classNames.stakeDelegatePageWrapper}>
      <div className={classNames.stakeDelegateHeaderWrapper}>
        <div className={classNames.pathLinkWrapper}>
          <Link href={`/portfolio/${state.walletAddress}?tab=${PortfolioTabs.REWARDS}`} prefetch>
            <Text as="p" variant="p1" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              $SUMR
            </Text>
          </Link>{' '}
          /{' '}
          <Text as="p" variant="p1">
            Stake & Delegate
          </Text>
        </div>
        <Text as="h2" variant="h2">
          Stake & Delegate
        </Text>
      </div>
      <Card variant="cardSecondary" className={classNames.stakeDelegateForm}>
        <ClaimDelegateStakeDelegateStep
          state={state}
          dispatch={dispatch}
          externalData={externalData}
        />
      </Card>
    </div>
  )
}
