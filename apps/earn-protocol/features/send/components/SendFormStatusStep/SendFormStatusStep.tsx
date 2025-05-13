import { type FC } from 'react'
import { Icon, IllustrationCircle, LoadingSpinner, Text } from '@summerfi/app-earn-ui'
import { formatAddress } from '@summerfi/app-utils'

import { type SendState, SendStep } from '@/features/send/types'

import classNames from './SendFormStatusStep.module.css'

interface FromToProps {
  variant: 'from' | 'to'
  address: string
}

const FromTo = ({ variant, address }: FromToProps) => {
  return (
    <div className={classNames.fromToWrapper}>
      <div className={classNames.iconWrapper}>
        <Icon iconName="wallet" size={20} color="var(--earn-protocol-secondary-40)" />
      </div>
      <div className={classNames.textualWrapper}>
        <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
          {variant === 'from' ? 'From' : 'To'}
        </Text>
        <Text as="p" variant="p3semi">
          {formatAddress(address)}
        </Text>
      </div>
    </div>
  )
}

type SendFormStatusStepProps = {
  state: SendState
}

export const SendFormStatusStep: FC<SendFormStatusStepProps> = ({ state }) => {
  return (
    <div className={classNames.sendFormStatusStepWrapper}>
      {state.step === SendStep.PENDING && (
        <div className={classNames.loadingBox}>
          <LoadingSpinner
            size={55}
            color="var(--earn-protocol-primary-100)"
            strokeWidth={3}
            gradient={{
              id: 'spinner-gradient',
              stops: [
                { offset: '0%', color: '#ff49a4' },
                { offset: '100%', color: '#b049ff' },
              ],
            }}
          />
        </div>
      )}
      {state.step === SendStep.COMPLETED && (
        <div className={classNames.loadingBox}>
          <IllustrationCircle icon="checkmark_colorful" size="extraLarge" iconSize={30} />
        </div>
      )}
      <div className={classNames.walletInfoWrapper}>
        <FromTo variant="from" address={state.walletAddress} />
        <div className={classNames.arrowWrapper}>
          <Icon iconName="arrow_forward" size={20} />
        </div>
        <FromTo variant="to" address={state.recipientAddress} />
      </div>
    </div>
  )
}
