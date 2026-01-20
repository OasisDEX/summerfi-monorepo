'use client'
import { type FC, useReducer } from 'react'
import { Card, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { ClaimDelegateCompletedStep } from '@/features/claim-and-delegate/components/ClaimDelegateCompletedStep/ClaimDelegateCompletedStep'
import { ClaimDelegateStakeStep } from '@/features/claim-and-delegate/components/ClaimDelegateStakeStep/ClaimDelegateStakeStep'
import { ClaimDelegateStep } from '@/features/claim-and-delegate/components/ClaimDelegateStep/ClaimDelegateStep'
import { claimDelegateReducer, claimDelegateState } from '@/features/claim-and-delegate/state'
import {
  type ClaimDelegateExternalData,
  ClaimDelegateSteps,
} from '@/features/claim-and-delegate/types'
import { PortfolioTabs } from '@/features/portfolio/types'

import classNames from './DelegatePageView.module.css'

interface DelegatePageViewProps {
  walletAddress: string
  externalData: ClaimDelegateExternalData
  sumrPriceUsd: number
}

export const DelegatePageView: FC<DelegatePageViewProps> = ({
  walletAddress,
  externalData,
  sumrPriceUsd,
}) => {
  const [state, dispatch] = useReducer(claimDelegateReducer, {
    ...claimDelegateState,
    step: ClaimDelegateSteps.DELEGATE,
    delegatee: externalData.sumrStakeDelegate.delegatedToV2,
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
            Delegate
          </Text>
        </div>
        <Text as="h2" variant="h2">
          Delegate
        </Text>
      </div>
      <Card variant="cardSecondary" className={classNames.stakeDelegateForm}>
        {state.step === ClaimDelegateSteps.DELEGATE && (
          <ClaimDelegateStep
            state={state}
            dispatch={dispatch}
            externalData={externalData}
            isJustDelegate
          />
        )}
        {state.step === ClaimDelegateSteps.STAKE && (
          <ClaimDelegateStakeStep
            state={state}
            dispatch={dispatch}
            externalData={externalData}
            sumrPriceUsd={sumrPriceUsd}
          />
        )}
        {state.step === ClaimDelegateSteps.COMPLETED && (
          <ClaimDelegateCompletedStep
            state={state}
            externalData={externalData}
            sumrPriceUsd={sumrPriceUsd}
          />
        )}
      </Card>
    </div>
  )
}
