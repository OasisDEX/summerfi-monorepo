'use client'

import { type ChangeEvent, useCallback, useState } from 'react'
import { useSignerStatus } from '@alchemy/aa-alchemy/react'

import { AccountKitLoginDialog } from '@/components/molecules/AccountKitLogin/AccountKitLoginDialog'

export const AccountKitLogin = () => {
  const [email, setEmail] = useState<string>('')
  const onEmailChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    [],
  )

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const { status } = useSignerStatus()
  const isAwaitingEmail = status === 'AWAITING_EMAIL_AUTH'

  return (
    <AccountKitLoginDialog
      onEmailChange={onEmailChange}
      isAwaitingEmail={isAwaitingEmail}
      email={email}
    />
  )
}
