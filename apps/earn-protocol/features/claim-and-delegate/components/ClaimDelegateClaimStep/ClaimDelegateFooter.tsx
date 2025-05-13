import { type FC } from 'react'
import { Button, WithArrow } from '@summerfi/app-earn-ui'

import classNames from './ClaimDelegateClaimStep.module.css'

interface ClaimDelegateFooterProps {
  canContinue: boolean
  onContinue: () => void
}

export const ClaimDelegateFooter: FC<ClaimDelegateFooterProps> = ({ canContinue, onContinue }) => {
  return (
    <div className={classNames.footerWrapper}>
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
