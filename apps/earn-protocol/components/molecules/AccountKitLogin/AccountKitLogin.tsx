'use client'

import { type ChangeEvent, type FC, useCallback, useState } from 'react'
import { useAuthenticate, useLogout, useSignerStatus, useUser } from '@alchemy/aa-alchemy/react'
import { Button, Card, Input, Text } from '@summerfi/app-ui'

import { Modal } from '@/components/atoms/Modal/Modal'

interface LoginDialogProps {
  isAwaitingEmail: boolean
  email: string
  onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const LoginDialog: FC<LoginDialogProps> = ({ isAwaitingEmail, email, onEmailChange }) => {
  const [modal, setModal] = useState(false)

  const { authenticate } = useAuthenticate({
    onSuccess: (_user) => {
      // eslint-disable-next-line no-console
      console.log('User', _user)
      setModal(false)
    },
  })
  const user = useUser()
  const { logout } = useLogout()

  const login = ({ type, signup }: { type: 'email' | 'passkey'; signup?: boolean }) => {
    switch (type) {
      case 'email':
        authenticate({ type: 'email', email })

        break
      case 'passkey':
        // eslint-disable-next-line no-unused-expressions
        signup
          ? authenticate({ type: 'passkey', createNew: true, username: 'summer-earn-user' })
          : authenticate({ type: 'passkey', createNew: false })

        break
      default:
        break
    }
  }

  const loginLogoutHandler = () => {
    if (user) {
      logout()
    } else {
      setModal(true)
    }
  }

  return (
    <>
      <Button variant="primarySmall" onClick={loginLogoutHandler} style={{ maxWidth: '200px' }}>
        {user ? `Logout` : 'Login'}
      </Button>

      <Modal openModal={modal} closeModal={() => setModal(false)}>
        <Card>
          <Button
            variant="unstyled"
            onClick={() => setModal(false)}
            style={{ position: 'absolute', right: '10px', top: '5px', color: 'grey' }}
          >
            x
          </Button>
          {isAwaitingEmail ? (
            <Text style={{ marginTop: '8px' }}>Check your email!</Text>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                rowGap: '16px',
                alignItems: 'center',
              }}
            >
              <Text style={{ marginTop: '8px' }}>Please enter below your e-mail to Log in</Text>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: '16px',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={onEmailChange}
                  style={{ marginBottom: '16px' }}
                />
                <Button onClick={() => login({ type: 'email' })} variant="primaryLarge">
                  Log in / Sign up
                </Button>
                ---- or using Pass Key ----
                <Button
                  onClick={() => login({ type: 'passkey' })}
                  variant="primaryLarge"
                  style={{ maxWidth: '200px' }}
                >
                  Login Pass Key
                </Button>
                <Button
                  onClick={() => login({ type: 'passkey', signup: true })}
                  variant="primaryLarge"
                  style={{ maxWidth: '200px' }}
                >
                  Sign up using Pass Key
                </Button>
              </div>
            </div>
          )}
        </Card>
      </Modal>
    </>
  )
}

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
    <LoginDialog onEmailChange={onEmailChange} isAwaitingEmail={isAwaitingEmail} email={email} />
  )
}
