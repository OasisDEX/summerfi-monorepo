import type { Dispatch, FC } from 'react'
import { Button, Card, Icon, Text, WithArrow } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'

import {
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  ClaimDelegateSteps,
} from '@/features/claim-and-delegate/types'

import classNames from './ClaimDelegateClaimStep.module.scss'

interface ClaimDelegateClaimStepProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
}

export const ClaimDelegateClaimStep: FC<ClaimDelegateClaimStepProps> = ({ dispatch }) => {
  const handleBack = () => {
    dispatch({ type: 'update-step', payload: ClaimDelegateSteps.TERMS })
  }

  const handleAccept = () => {
    dispatch({ type: 'update-step', payload: ClaimDelegateSteps.DELEGATE })
  }

  const earned = formatCryptoBalance(123)
  const earnedInUSD = formatFiatBalance(123)

  return (
    <div className={classNames.claimDelegateClaimStepWrapper}>
      <Card className={classNames.cardWrapper}>
        <Text as="p" variant="p1semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
          You have earned
        </Text>
        <div className={classNames.valueWithIcon}>
          <Icon tokenName="SUMR" />
          <Text as="h2" variant="h2">
            {earned}
          </Text>
        </div>
        <Text as="p" variant="p2semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
          ${earnedInUSD}
        </Text>
      </Card>
      <div className={classNames.footerWrapper}>
        <Button variant="secondarySmall" onClick={handleBack}>
          <Text variant="p3semi" as="p">
            Back
          </Text>
        </Button>
        <Button
          variant="primarySmall"
          style={{ paddingRight: 'var(--general-space-32)' }}
          onClick={handleAccept}
        >
          <WithArrow
            style={{ color: 'var(--earn-protocol-secondary-100)' }}
            variant="p3semi"
            as="p"
          >
            Claim
          </WithArrow>
        </Button>
      </div>
    </div>
  )
}
