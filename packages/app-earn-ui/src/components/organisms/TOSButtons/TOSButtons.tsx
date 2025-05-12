import type { FC } from 'react'
import { type TOSState, TOSStatus } from '@summerfi/app-types'

import { Button } from '@/components/atoms/Button/Button'
import { Text } from '@/components/atoms/Text/Text'

import tosButtonsStyles from '@/components/organisms/TOSButtons/TOSButtons.module.css'

const withDisconnectButtonStep = [
  TOSStatus.WAITING_FOR_ACCEPTANCE,
  TOSStatus.WAITING_FOR_ACCEPTANCE_UPDATED,
  TOSStatus.WAITING_FOR_SIGNATURE,
  TOSStatus.RETRY,
]

const withToggleStep = [TOSStatus.WAITING_FOR_ACCEPTANCE, TOSStatus.WAITING_FOR_ACCEPTANCE_UPDATED]

interface TOSButtonsProps {
  primaryLabel?: string
  secondaryLabel?: string
  toggle: boolean
  tosState: TOSState
  disconnect: () => void
}

const getPrimaryLabel = ({ tosState }: { tosState: TOSState }) => {
  switch (tosState.status) {
    case TOSStatus.INIT:
    case TOSStatus.DONE:
      return ''
    case TOSStatus.WAITING_FOR_SIGNATURE:
      return 'Sign message'
    case TOSStatus.WAITING_FOR_ACCEPTANCE:
    case TOSStatus.WAITING_FOR_ACCEPTANCE_UPDATED:
      return 'Continue'
    case TOSStatus.LOADING:
      return tosState.previousStatus === TOSStatus.WAITING_FOR_SIGNATURE
        ? 'Waiting for signature...'
        : 'Waiting for acceptance...'
    case TOSStatus.RETRY:
      return 'Try again'
    default:
      return ''
  }
}

const getSecondaryLabel = ({ tosState }: { tosState: TOSState }) => {
  switch (tosState.status) {
    case TOSStatus.WAITING_FOR_SIGNATURE:
    case TOSStatus.WAITING_FOR_ACCEPTANCE:
    case TOSStatus.WAITING_FOR_ACCEPTANCE_UPDATED:
    case TOSStatus.RETRY:
      return 'Disconnect'
    case TOSStatus.INIT:
    case TOSStatus.DONE:
    case TOSStatus.LOADING:
    default:
      return ''
  }
}

export const TOSButtons: FC<TOSButtonsProps> = ({
  primaryLabel,
  secondaryLabel,
  toggle,
  tosState,
  disconnect,
}) => {
  return (
    <div className={tosButtonsStyles.tosButtonsWrapper}>
      <Button
        variant="primaryLarge"
        disabled={
          (withToggleStep.includes(tosState.status) && !toggle) ||
          tosState.status === TOSStatus.LOADING
        }
        onClick={
          // eslint-disable-next-line no-console
          'action' in tosState ? tosState.action : () => console.warn('TOS - No action available')
        }
      >
        {primaryLabel ?? getPrimaryLabel({ tosState })}
      </Button>
      {withDisconnectButtonStep.includes(tosState.status) && (
        <Button variant="unstyled" onClick={disconnect}>
          <Text as="p" variant="p3semi" style={{ color: 'var(--color-interactive-100)' }}>
            {secondaryLabel ?? getSecondaryLabel({ tosState })}
          </Text>
        </Button>
      )}
    </div>
  )
}
