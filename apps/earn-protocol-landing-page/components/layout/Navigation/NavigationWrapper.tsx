'use client'

import { type FC } from 'react'
import { Button, getNavigationItems, Navigation } from '@summerfi/app-earn-ui'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import navigationWrapperStyles from './NavigationWrapper.module.scss'

export const NavigationWrapper: FC = () => {
  const currentPath = usePathname()

  return (
    <Navigation
      currentPath={currentPath}
      logo="/img/branding/logo-dark.svg"
      logoSmall="/img/branding/dot-dark.svg"
      links={getNavigationItems({})}
      signupComponent={
        <Button
          variant="primarySmall"
          className={clsx(navigationWrapperStyles.actionButton, navigationWrapperStyles.gradient)}
        >
          Sign up
        </Button>
      }
      walletConnectionComponent={
        <Link href="/earn">
          <Button
            variant="secondarySmall"
            onClick={() => {}}
            className={navigationWrapperStyles.actionButton}
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
