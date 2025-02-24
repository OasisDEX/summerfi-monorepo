import { type FC } from 'react'
import { Button, Text, WithArrow } from '@summerfi/app-earn-ui'

import classNames from './ClaimDelegateClaimStep.module.scss'

interface ClaimDelegateFooterProps {
  canContinue: boolean
  onBack: () => void
  onContinue: () => void
}

export const ClaimDelegateFooter: FC<ClaimDelegateFooterProps> = ({
  canContinue,
  onBack,
  onContinue,
}) => {
  return (
    <div className={classNames.footerWrapper}>
      <Button variant="secondaryMedium" onClick={onBack}>
        <Text variant="p3semi" as="p">
          Back
        </Text>
      </Button>

      <Button variant="primaryMedium" onClick={onContinue} disabled={!canContinue}>
        <WithArrow
          reserveSpace
          variant="p3semi"
          as="p"
          disabled={!canContinue}
          style={{
            color: canContinue ? 'var(--earn-protocol-secondary-100)' : 'var(--color-text-inverse)',
          }}
        >
          Continue
        </WithArrow>
      </Button>
    </div>
  )
}
