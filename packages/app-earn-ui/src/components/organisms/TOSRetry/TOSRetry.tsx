'use client'
import { type FC, type ReactNode } from 'react'
import { type TOSRetryStep } from '@summerfi/app-types'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'

import tosRetryStyles from '@/components/organisms/TOSRetry/TOSRetry.module.scss'

interface TOSRetryProps {
  tosState: TOSRetryStep
  texts?: {
    tosRetry?: ReactNode
    tosRetryMessage?: ReactNode
    tosUserRejectedMessage?: ReactNode
  }
}

const defaultTexts = {
  tosRetry: 'Terms of Service',
  tosRetryMessage:
    'It looks like something went wrong during signature / acceptance step. Please try again or contact with support.',
  tosUserRejectedMessage: 'It looks like you rejected signature. Please try again.',
}

export const TOSRetry: FC<TOSRetryProps> = ({ tosState, texts = defaultTexts }) => {
  const isRejectedByUser = tosState.error.includes('user rejected action')

  return (
    <div className={tosRetryStyles.tosRetryWrapper}>
      <Text as="h4" variant="h4" style={{ textAlign: 'center' }}>
        {texts.tosRetry}
      </Text>
      <Text as="p" variant="p3" className={tosRetryStyles.tosRetryMessage}>
        {isRejectedByUser ? texts.tosUserRejectedMessage : texts.tosRetryMessage}
      </Text>
      <div className={tosRetryStyles.tosRetryIconWrapper}>
        <Icon iconName="close_squared" size={32} />
      </div>
    </div>
  )
}
