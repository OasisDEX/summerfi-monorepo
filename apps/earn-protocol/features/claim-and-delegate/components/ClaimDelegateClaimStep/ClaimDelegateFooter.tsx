import { type FC } from 'react'
import { Button, Text, WithArrow } from '@summerfi/app-earn-ui'

import classNames from './ClaimDelegateClaimStep.module.scss'

interface ClaimDelegateFooterProps {
  canContinue: boolean
  onBack: () => void
  onSkipOrContinue: () => void
}

export const ClaimDelegateFooter: FC<ClaimDelegateFooterProps> = ({
  canContinue,
  onBack,
  onSkipOrContinue,
}) => {
  return (
    <div className={classNames.footerWrapper}>
      <Button variant="secondaryMedium" onClick={onBack}>
        <Text variant="p3semi" as="p">
          Back
        </Text>
      </Button>

      <Button variant="primaryMedium" onClick={onSkipOrContinue}>
        <WithArrow
          reserveSpace
          variant="p3semi"
          as="p"
          style={{ color: 'var(--earn-protocol-secondary-100)' }}
        >
          {canContinue ? 'Continue' : 'Skip'}
        </WithArrow>
      </Button>
    </div>
  )
}
