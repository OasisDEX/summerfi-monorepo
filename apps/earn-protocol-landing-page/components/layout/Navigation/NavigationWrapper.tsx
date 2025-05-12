'use client'

import { type FC } from 'react'
import { Button, getNavigationItems, Navigation } from '@summerfi/app-earn-ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import navigationWrapperStyles from './NavigationWrapper.module.css'

export const NavigationWrapper: FC = () => {
  const currentPath = usePathname()

  return (
    <Navigation
      currentPath={currentPath}
      logo="/img/branding/logo-dark.svg"
      logoSmall="/img/branding/dot-dark.svg"
      links={getNavigationItems({})}
      walletConnectionComponent={
        <Link href="/earn">
          <Button
            variant="primaryMedium"
            onClick={() => {}}
            className={(navigationWrapperStyles.actionButton, navigationWrapperStyles.gradient)}
          >
            Launch app
          </Button>
        </Link>
      }
      onLogoClick={() => {
        // because router will use base path...
        window.location.href = '/'
      }}
    />
  )
}
