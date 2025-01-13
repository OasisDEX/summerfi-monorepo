import type { Dispatch, FC } from 'react'
import { Button, Card, Icon, Text, WithArrow } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'

import { SUMR_CAP } from '@/constants/earn-protocol'
import { useLocalConfig } from '@/contexts/LocalConfigContext/LocalConfigContext'
import {
  type ClaimDelegateExternalData,
  type ClaimDelegateReducerAction,
  type ClaimDelegateState,
  ClaimDelegateSteps,
} from '@/features/claim-and-delegate/types'

import classNames from './ClaimDelegateClaimStep.module.scss'

interface ClaimDelegateClaimStepProps {
  state: ClaimDelegateState
  dispatch: Dispatch<ClaimDelegateReducerAction>
  externalData: ClaimDelegateExternalData
}

export const ClaimDelegateClaimStep: FC<ClaimDelegateClaimStepProps> = ({
  dispatch,
  externalData,
}) => {
  const {
    state: { sumrNetApyConfig },
  } = useLocalConfig()
  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  const handleBack = () => {
    dispatch({ type: 'update-step', payload: ClaimDelegateSteps.TERMS })
  }

  const handleAccept = () => {
    dispatch({ type: 'update-step', payload: ClaimDelegateSteps.DELEGATE })
  }

  const earned = formatCryptoBalance(externalData.sumrEarned)
  const earnedInUSD = formatFiatBalance(Number(externalData.sumrEarned) * estimatedSumrPrice)

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
