'use client'
import { type FC, useReducer } from 'react'
import { Card, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { ClaimDelegateCompletedStep } from '@/features/claim-and-delegate/components/ClaimDelegateCompletedStep/ClaimDelegateCompletedStep'
import { ClaimDelegateFormHeader } from '@/features/claim-and-delegate/components/ClaimDelegateFormHeader/ClaimDelegateFormHeader'
import { ClaimDelegateStakeStep } from '@/features/claim-and-delegate/components/ClaimDelegateStakeStep/ClaimDelegateStakeStep'
import { ClaimDelegateStep } from '@/features/claim-and-delegate/components/ClaimDelegateStep/ClaimDelegateStep'
import { claimDelegateReducer, claimDelegateState } from '@/features/claim-and-delegate/state'
import {
  type ClaimDelegateExternalData,
  ClaimDelegateSteps,
} from '@/features/claim-and-delegate/types'
import { PortfolioTabs } from '@/features/portfolio/types'

import classNames from './StakeDelegatePageView.module.css'

interface StakeDelegatePageViewProps {
  walletAddress: string
  externalData: ClaimDelegateExternalData
}

export const StakeDelegatePageView: FC<StakeDelegatePageViewProps> = ({
  walletAddress,
  externalData,
}) => {
  const searchParams = useSearchParams()
  const step = searchParams.get('step')
  const resolvedStep = step === 'stake' ? ClaimDelegateSteps.STAKE : ClaimDelegateSteps.DELEGATE

  const [state, dispatch] = useReducer(claimDelegateReducer, {
    ...claimDelegateState,
    step: resolvedStep,
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
            Delegate & Stake
          </Text>
        </div>
        <Text as="h2" variant="h2">
          Delegate & Stake
        </Text>
      </div>
      <Card variant="cardSecondary" className={classNames.stakeDelegateForm}>
        <ClaimDelegateFormHeader state={state} isJustStakeDelegate />
        <div className={classNames.separator} />
        {state.step === ClaimDelegateSteps.DELEGATE && (
          <ClaimDelegateStep state={state} dispatch={dispatch} externalData={externalData} />
        )}
        {state.step === ClaimDelegateSteps.STAKE && (
          <ClaimDelegateStakeStep state={state} dispatch={dispatch} externalData={externalData} />
        )}
        {state.step === ClaimDelegateSteps.COMPLETED && (
          <ClaimDelegateCompletedStep state={state} externalData={externalData} />
        )}
      </Card>
    </div>
  )
}
