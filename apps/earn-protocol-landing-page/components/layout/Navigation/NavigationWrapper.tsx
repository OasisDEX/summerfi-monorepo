'use client'

import { Button, getNavigationItems, Navigation } from '@summerfi/app-earn-ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import navigationWrapperStyles from './NavigationWrapper.module.scss'

export const NavigationWrapper: React.FC = () => {
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
            variant="primarySmall"
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
