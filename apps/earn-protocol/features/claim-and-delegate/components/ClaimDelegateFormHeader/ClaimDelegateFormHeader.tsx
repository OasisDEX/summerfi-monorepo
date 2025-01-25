import { type FC } from 'react'
import { Icon, Text } from '@summerfi/app-earn-ui'
import clsx from 'clsx'

import {
  type ClaimDelegateState,
  ClaimDelegateSteps,
  ClaimDelegateTxStatuses,
} from '@/features/claim-and-delegate/types'

import classNames from './ClaimDelegateFormHeader.module.scss'

const getSteps = (isJustStakeDelegate: boolean) => [
  ...(!isJustStakeDelegate
    ? [
        {
          label: 'Accept Terms',
          value: ClaimDelegateSteps.TERMS,
        },
        {
          label: 'Claim $SUMR',
          value: ClaimDelegateSteps.CLAIM,
        },
      ]
    : []),
  {
    label: 'Delegate',
    value: ClaimDelegateSteps.DELEGATE,
  },
  {
    label: 'Stake',
    value: ClaimDelegateSteps.STAKE,
  },
  {
    label: 'Completed',
    value: ClaimDelegateSteps.COMPLETED,
  },
]

const getIsCompleted = ({
  idx,
  state,
  steps,
}: {
  idx: number
  state: ClaimDelegateState
  steps: { label: string; value: ClaimDelegateSteps }[]
}) =>
  idx < steps.findIndex((item) => item.value === state.step) ||
  (state.step === ClaimDelegateSteps.DELEGATE &&
    state.delegateStatus === ClaimDelegateTxStatuses.COMPLETED)

interface ClaimDelegateFormHeaderProps {
  state: ClaimDelegateState
  isJustStakeDelegate?: boolean
}

export const ClaimDelegateFormHeader: FC<ClaimDelegateFormHeaderProps> = ({
  state,
  isJustStakeDelegate,
}) => {
  const steps = getSteps(!!isJustStakeDelegate)

  return (
    <div className={classNames.claimDelegateFormHeaderWrapper}>
      {steps.map((step, idx) => (
        <div className={classNames.step} key={step.value}>
          <div
            className={clsx(classNames.circle, {
              [classNames.active]:
                step.value === state.step && !getIsCompleted({ idx, state, steps }),
              [classNames.completed]: getIsCompleted({ idx, state, steps }),
            })}
          >
            {!getIsCompleted({ idx, state, steps }) && (
              <Text as="p" variant="p2semi">
                {idx + 1}
              </Text>
            )}
            {getIsCompleted({ idx, state, steps }) && (
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
