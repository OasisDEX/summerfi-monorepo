import { type FC } from 'react'
import { Button, Card, Icon, Text } from '@summerfi/app-earn-ui'

import classNames from './ClaimDelegateClaimStep.module.scss'

interface ClaimDelegateErrorProps {
  error: string
  onBack: () => void
}

export const ClaimDelegateError: FC<ClaimDelegateErrorProps> = ({ error, onBack }) => {
  return (
    <div className={classNames.claimDelegateClaimStepWrapper}>
      <Card className={classNames.cardWrapper}>
        <div className={classNames.errorContent}>
          <Icon iconName="warning" size={48} style={{ color: 'var(--earn-protocol-error-60)' }} />
          <div className={classNames.errorTextWrapper}>
            <Text as="h2" variant="h4" style={{ color: 'var(--earn-protocol-error-60)' }}>
              {error}
            </Text>
            <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
              Please try again.
            </Text>
          </div>
        </div>
      </Card>

      <div className={classNames.footerWrapper}>
        <Button variant="secondarySmall" onClick={onBack}>
          <Text variant="p3semi" as="p">
            Back
          </Text>
        </Button>
      </div>
    </div>
  )
}
