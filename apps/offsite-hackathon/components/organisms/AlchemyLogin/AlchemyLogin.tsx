'use client'

import { ChangeEvent, FC, FormEvent, useCallback, useState } from 'react'
import { useAuthenticate, useLogout, useSignerStatus, useUser } from '@alchemy/aa-alchemy/react'
import { Button, Card, Input, Text } from '@summerfi/app-ui'

import { Modal } from '@/components/components/Modal/Modal'

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

  const login = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    authenticate({ type: 'email', email })
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
      <Button variant="primarySmall" onClick={loginLogoutHandler}>
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
            <div style={{ display: 'flex', flexDirection: 'column', rowGap: '16px' }}>
              <Text style={{ marginTop: '8px' }}>Please enter below your e-mail to Log in</Text>
              <form onSubmit={login}>
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={onEmailChange}
                  style={{ marginBottom: '16px' }}
                />
                <Button
                  // @ts-ignore
                  type="submit"
                  variant="primaryLarge"
                >
                  Log in
                </Button>
              </form>
            </div>
          )}
        </Card>
      </Modal>
    </>
  )
}

export const AlchemyLogin = () => {
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
