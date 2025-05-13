'use client'
import { type FC, type ReactNode } from 'react'

import { Text } from '@/components/atoms/Text/Text'

import tosWaitingForSignatureStyles from '@/components/organisms/TOSWaitingForSignature/TOSWaitingForSignature.module.css'

interface TOSWaitingForSignatureProps {
  texts?: {
    tosWelcome?: ReactNode
    tosSignatureMessage?: ReactNode
    signMessage?: ReactNode
    disconnect?: ReactNode
  }
}

const defaultTexts = {
  tosWelcome: 'Welcome',
  tosSignatureMessage:
    "It looks like you're new to Summer.fi or are using a new device to connect. For Security please accept our Terms of Service and sign a message with your wallet to continue.",
  signMessage: 'Sign message',
  disconnect: 'Disconnect',
}

export const TOSWaitingForSignature: FC<TOSWaitingForSignatureProps> = ({
  texts = defaultTexts,
}) => {
  return (
    <div className={tosWaitingForSignatureStyles.tosWaitingForSignatureWrapper}>
      <Text as="h4" variant="h4" style={{ textAlign: 'center' }}>
        {texts.tosWelcome}
      </Text>
      <Text
        as="p"
        variant="p3"
        className={tosWaitingForSignatureStyles.tosWaitingForSignatureMessage}
      >
        {texts.tosSignatureMessage}
      </Text>
    </div>
  )
}
