'use client'
import { type FC, type ReactNode } from 'react'
import {
  TOSStatus,
  type TOSWaitingForAcceptanceStep,
  type TOSWaitingForAcceptanceUpdatedStep,
} from '@summerfi/app-types'

import { CheckboxButton } from '@/components/atoms/CheckboxButton/CheckboxButton'
import { Text } from '@/components/atoms/Text/Text'

import tosWaitingForAcceptanceStyles from '@/components/organisms/TOSWaitingForAcceptance/TOSWaitingForAcceptance.module.css'

export interface TOSWaiting4AcceptanceProps {
  tosState: TOSWaitingForAcceptanceStep | TOSWaitingForAcceptanceUpdatedStep
  handleToggle: () => void
  toggle: boolean
  documentLink: string
  texts?: {
    tosWelcome?: ReactNode
    tosWelcomeUpdated?: ReactNode
    tosAcceptMessage?: ReactNode
    tosAcceptMessageUpdated?: ReactNode
    tosView?: ReactNode
    tosRead?: ReactNode
    continue?: ReactNode
    disconnect?: ReactNode
  }
}

const defaultTexts = {
  tosWelcome: 'Welcome',
  tosWelcomeUpdated: 'We’ve updated our terms',
  tosAcceptMessage:
    'Before you can get started, you’ll need to read and accept our terms of service.',
  tosAcceptMessageUpdated:
    'We have recently updated our Terms of Service. For security please accept our terms of service to continue.',
  tosView: 'View Terms of Service',
  tosRead: 'I have read and accept the Terms of Service.',
  continue: 'Continue',
  disconnect: 'Disconnect',
}

export const TOSWaitingForAcceptance: FC<TOSWaiting4AcceptanceProps> = ({
  documentLink,
  handleToggle,
  toggle,
  tosState,
  texts = defaultTexts,
}) => {
  const updated = tosState.status === TOSStatus.WAITING_FOR_ACCEPTANCE_UPDATED

  return (
    <div
      className={tosWaitingForAcceptanceStyles.flexColumnWrapper}
      style={{
        rowGap: 'var(--space-m)',
      }}
    >
      <Text as="h4" variant="h4" style={{ textAlign: 'center' }}>
        {updated ? texts.tosWelcomeUpdated : texts.tosWelcome}
      </Text>
      <div
        className={tosWaitingForAcceptanceStyles.flexColumnWrapper}
        style={{
          rowGap: 'var(--space-l)',
        }}
      >
        <Text
          style={{
            fontSize: '14px',
            textAlign: 'center',
            color: 'var(--color-primary-100)',
          }}
        >
          {updated ? texts.tosAcceptMessageUpdated : texts.tosAcceptMessage}
        </Text>
        <Text
          as="p"
          variant="p2semi"
          style={{ color: 'var(--color-interactive-100)', textAlign: 'center', cursor: 'pointer' }}
        >
          <a href={documentLink} target="_blank" rel="noreferrer">
            {texts.tosView}
          </a>
        </Text>
        <CheckboxButton
          label={
            <Text
              style={{
                flex: 1,
                fontWeight: '400',
                fontSize: '14px',
                color: 'var(--color-primary-100)',
              }}
            >
              {texts.tosRead}
            </Text>
          }
          name="tos-acceptance"
          onChange={handleToggle}
          checked={toggle}
        />
      </div>
    </div>
  )
}
