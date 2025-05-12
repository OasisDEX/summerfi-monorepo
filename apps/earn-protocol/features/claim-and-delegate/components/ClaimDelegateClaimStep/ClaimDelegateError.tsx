import { type FC } from 'react'
import { Alert, Button } from '@summerfi/app-earn-ui'

import classNames from './ClaimDelegateClaimStep.module.css'

interface ClaimDelegateErrorProps {
  error: string
  onBack: () => void
}

export const ClaimDelegateError: FC<ClaimDelegateErrorProps> = ({ error, onBack }) => {
  return (
    <div className={classNames.claimDelegateClaimStepWrapper}>
      <div className={classNames.errorWrapper}>
        <Alert error={error} />
        <div style={{ marginTop: 'var(--spacing-space-medium)' }}>
          <Button variant="secondarySmall" onClick={onBack}>
            Back
          </Button>
        </div>
      </div>
    </div>
  )
}

interface ClaimDelegateNoBalancesProps {
  onContinue: () => void
}

export const ClaimDelegateNoBalances: FC<ClaimDelegateNoBalancesProps> = ({ onContinue }) => {
  return (
    <div className={classNames.claimDelegateClaimStepWrapper}>
      <div className={classNames.errorWrapper}>
        <Alert
          variant="general"
          iconName="info"
          error="You don't have any $SUMR to claim or bridge"
        />
        <div style={{ marginTop: 'var(--spacing-space-medium)' }}>
          <Button variant="secondarySmall" onClick={onContinue}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
