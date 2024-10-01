'use client'

import { type FC } from 'react'
import { useAuthModal, useLogout, useSignerStatus, useUser } from '@account-kit/react'
import { Button, Navigation } from '@summerfi/app-ui'
import { usePathname } from 'next/navigation'

export const NavigationWrapper: FC = () => {
  const currentPath = usePathname()

  const user = useUser()
  const { openAuthModal } = useAuthModal()
  const signerStatus = useSignerStatus()
  const { logout } = useLogout()

  return (
    <Navigation
      currentPath={currentPath}
      logo="/img/branding/logo-dark.svg"
      logoSmall="/img/branding/dot-dark.svg"
      links={[
        {
          label: 'Earn',
          link: `/earn`,
        },
        ...(user?.address
          ? [
              {
                label: 'Portfolio',
                link: `/portfolio/${user.address}`,
              },
            ]
          : []),
        {
          label: 'Explore',
          link: `/#`,
        },
      ]}
      walletConnectionComponent={
        <Button
          variant="secondarySmall"
          onClick={user ? () => logout() : openAuthModal}
          disabled={signerStatus.isInitializing}
        >
          {signerStatus.isInitializing ? 'Loading...' : user ? 'Log out' : 'Login'}
        </Button>
      }
      onLogoClick={() => {
        // because router will use base path...
        window.location.href = '/'
      }}
    />
  )
}
