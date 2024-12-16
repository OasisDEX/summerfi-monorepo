import { type FC } from 'react'
import { Icon, Text } from '@summerfi/app-earn-ui'
import clsx from 'clsx'

import { type ClaimDelegateState, ClaimDelegateSteps } from '@/features/claim-and-delegate/types'

import classNames from './ClaimDelegateFormHeader.module.scss'

const steps = [
  {
    label: 'Accept Terms',
    value: ClaimDelegateSteps.TERMS,
  },
  {
    label: 'Claim $SUMR',
    value: ClaimDelegateSteps.CLAIM,
  },
  {
    label: 'Stake & Delegate',
    value: ClaimDelegateSteps.DELEGATE,
  },
]

const getIsCompleted = ({ idx, currentStep }: { idx: number; currentStep: ClaimDelegateSteps }) =>
  idx < steps.findIndex((item) => item.value === currentStep)

interface ClaimDelegateFormHeaderProps {
  state: ClaimDelegateState
}

export const ClaimDelegateFormHeader: FC<ClaimDelegateFormHeaderProps> = ({ state }) => {
  return (
    <div className={classNames.claimDelegateFormHeaderWrapper}>
      {steps.map((step, idx) => (
        <div className={classNames.step} key={step.value}>
          <div
            className={clsx(classNames.circle, {
              [classNames.active]: step.value === state.step,
              [classNames.completed]: getIsCompleted({ idx, currentStep: state.step }),
            })}
          >
            {!getIsCompleted({ idx, currentStep: state.step }) && (
              <Text as="p" variant="p2semi">
                {idx + 1}
              </Text>
            )}
            {getIsCompleted({ idx, currentStep: state.step }) && (
              <Icon iconName="checkmark" variant="xs" color="var(--earn-protocol-success-100)" />
            )}
          </div>
          {step.label}
          {steps.length - 1 !== idx && (
            <Text
              as="p"
              variant="p2semi"
              style={{
                color: 'var(--earn-protocol-secondary-40)',
                marginLeft: 'var(--general-space-8)',
                marginRight: 'var(--general-space-24)',
              }}
            >
              {'->'}
            </Text>
          )}
        </div>
      ))}
    </div>
  )
}
