'use client'

import { type ChangeEvent, type FC, useState } from 'react'
import { useAuthenticate, useLogout, useUser } from '@alchemy/aa-alchemy/react'
import { Button, Card, Input, Modal, Text } from '@summerfi/app-ui'

import { AccountKitAuthenticationMethod } from '@/providers/AlchemyAccountsProvider/types'

interface AccountKitLoginDialogProps {
  isAwaitingEmail: boolean
  email: string
  onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const AccountKitLoginDialog: FC<AccountKitLoginDialogProps> = ({
  isAwaitingEmail,
  email,
  onEmailChange,
}) => {
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

  const login = ({ type, signup }: { type: AccountKitAuthenticationMethod; signup?: boolean }) => {
    switch (type) {
      case AccountKitAuthenticationMethod.EMAIL:
        authenticate({ type, email })

        break
      case AccountKitAuthenticationMethod.PASSKEY:
        // eslint-disable-next-line no-unused-expressions
        signup
          ? authenticate({
              type,
              createNew: true,
              username: 'summer-earn-user',
            })
          : authenticate({ type, createNew: false })

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
                  wrapperStyles={{ marginBottom: '16px', width: '100%' }}
                  style={{ width: '100%' }}
                />
                <Button
                  onClick={() => login({ type: AccountKitAuthenticationMethod.EMAIL })}
                  variant="primaryLarge"
                >
                  Log in / Sign up
                </Button>
                ---- or using Pass Key ----
                <Button
                  onClick={() => login({ type: AccountKitAuthenticationMethod.PASSKEY })}
                  variant="primaryLarge"
                  style={{ maxWidth: '200px' }}
                >
                  Login Pass Key
                </Button>
                <Button
                  onClick={() =>
                    login({ type: AccountKitAuthenticationMethod.PASSKEY, signup: true })
                  }
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
