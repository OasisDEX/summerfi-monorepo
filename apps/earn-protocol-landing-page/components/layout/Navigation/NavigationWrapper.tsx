'use client'

import { type FC } from 'react'
import { Button, getNavigationItems, Navigation } from '@summerfi/app-earn-ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import navigationWrapperStyles from './NavigationWrapper.module.css'

export const NavigationWrapper: FC = () => {
  const currentPath = usePathname()
  const isBeachClub = currentPath.includes('beach-club')

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 2,
      }}
    >
      <Navigation
        currentPath={currentPath}
        logo={isBeachClub ? '/img/branding/logo-beach-club.svg' : '/img/branding/logo-dark.svg'}
        logoSmall="/img/branding/dot-dark.svg"
        links={getNavigationItems({})}
        walletConnectionComponent={
          <Link href="/earn" prefetch={false}>
            <Button
              variant={isBeachClub ? 'beachClubMedium' : 'primaryMedium'}
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
    </div>
  )
}
