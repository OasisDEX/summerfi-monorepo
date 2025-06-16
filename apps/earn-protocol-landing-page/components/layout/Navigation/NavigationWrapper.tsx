'use client'

import { type FC } from 'react'
import { Button, getNavigationItems, Navigation } from '@summerfi/app-earn-ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useLandingPageData } from '@/contexts/LandingPageContext'

import navigationWrapperStyles from './NavigationWrapper.module.css'

export const NavigationWrapper: FC = () => {
  const currentPath = usePathname()
  const { landingPageData } = useLandingPageData()
  const { features } = landingPageData?.systemConfig ?? {}
  const isBeachClub = currentPath.includes('beach-club')

  return (
    <Navigation
      currentPath={currentPath}
      logo={isBeachClub ? '/img/branding/logo-beach-club.svg' : '/img/branding/logo-dark.svg'}
      logoSmall="/img/branding/dot-dark.svg"
      links={getNavigationItems({})}
      walletConnectionComponent={
        <Link href="/earn" prefetch={false}>
          <Button
            variant={isBeachClub ? 'beachClubMedium' : 'primaryMedium'}
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
      featuresConfig={features}
    />
  )
}
