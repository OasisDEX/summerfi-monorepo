'use client'

import { type FC } from 'react'
import { Button, Navigation } from '@summerfi/app-earn-ui'
import { usePathname } from 'next/navigation'

export const NavigationWrapper: FC = () => {
  const currentPath = usePathname()

  return (
    <Navigation
      currentPath={currentPath}
      logo="/img/branding/logo-dark.svg"
      logoSmall="/img/branding/dot-dark.svg"
      links={[
        {
          label: 'Earn',
          id: 'earn',
          link: `/earn`,
        },
        {
          label: 'Explore',
          id: 'explore',
          dropdownContent: <div>Explore content here</div>,
        },
        {
          label: 'Support',
          id: 'support',
          dropdownContent: <div>Support content here</div>,
        },
      ]}
      walletConnectionComponent={
        <Button variant="secondarySmall" onClick={() => {}}>
          Action!
        </Button>
      }
      onLogoClick={() => {
        // because router will use base path...
        window.location.href = '/'
      }}
    />
  )
}
