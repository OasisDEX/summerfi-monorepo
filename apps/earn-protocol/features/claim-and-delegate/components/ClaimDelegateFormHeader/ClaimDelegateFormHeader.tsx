import { type FC } from 'react'
import { Icon, Text } from '@summerfi/app-earn-ui'
import clsx from 'clsx'

import {
  type ClaimDelegateState,
  ClaimDelegateSteps,
  ClaimDelegateTxStatuses,
} from '@/features/claim-and-delegate/types'

import classNames from './ClaimDelegateFormHeader.module.css'

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
      {steps.map(
        (step, idx) =>
          !(idx === steps.length - 1) && (
            <div className={classNames.step} key={step.value}>
              <div
                className={clsx(classNames.circle, {
                  [classNames.active]:
                    step.value === state.step && !getIsCompleted({ idx, state, steps }),
                  [classNames.completed]: getIsCompleted({ idx, state, steps }),
                })}
              >
                {!getIsCompleted({ idx, state, steps }) && (
                  <Text as="p" variant="p2semi" className={classNames.circleText}>
                    {idx + 1}
                  </Text>
                )}
                {getIsCompleted({ idx, state, steps }) && (
                  <Icon
                    iconName="checkmark"
                    variant="xs"
                    color="var(--earn-protocol-success-100)"
                  />
                )}
              </div>
              <Text as="p" variant="p2semi" className={classNames.stepLabel}>
                {step.label}
              </Text>
              {steps.length - 2 !== idx && (
                <Text as="p" variant="p2semi" className={classNames.stepArrow}>
                  {'->'}
                </Text>
              )}
            </div>
          ),
      )}
    </div>
  )
}
