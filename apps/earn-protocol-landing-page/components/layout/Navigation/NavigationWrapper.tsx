'use client'

import { type FC } from 'react'
import {
  Button,
  getNavigationItems,
  Navigation,
  NavigationExtraComponents,
} from '@summerfi/app-earn-ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useLandingPageData } from '@/contexts/LandingPageContext'
import { EarnProtocolEvents } from '@/helpers/mixpanel'

import navigationWrapperStyles from './NavigationWrapper.module.css'

export const NavigationWrapper: FC = () => {
  const currentPath = usePathname()
  const { landingPageData } = useLandingPageData()
  const { features } = landingPageData?.systemConfig ?? {}
  const isBeachClub = currentPath.includes('beach-club')

  const onNavItemClick = ({
    buttonName,
    isEarnApp,
  }: {
    buttonName: string
    isEarnApp?: boolean
  }) => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `${isEarnApp ? 'ep' : 'lp'}-navigation-${buttonName}`,
      page: currentPath,
    })
  }

  return (
    <Navigation
      currentPath={currentPath}
      logo={isBeachClub ? '/img/branding/logo-beach-club.svg' : '/img/branding/logo-dark.svg'}
      logoSmall="/img/branding/dot-dark.svg"
      links={getNavigationItems({ features, onNavItemClick })}
      walletConnectionComponent={
        <Link
          href="/earn"
          prefetch={false}
          onClick={() => onNavItemClick({ buttonName: 'launch-app', isEarnApp: false })}
        >
          <Button
            variant={isBeachClub ? 'beachClubMedium' : 'primaryMedium'}
            className={navigationWrapperStyles.actionButton}
          >
            Launch app
          </Button>
        </Link>
      }
      startTheGame={
        features?.Game
          ? () => {
              window.location.href = '/earn?game'
            }
          : undefined
      }
      onLogoClick={() => {
        onNavItemClick({ buttonName: 'logo', isEarnApp: false })
        // because router will use base path...
        window.location.href = '/'
      }}
      featuresConfig={features}
      extraComponents={
        <NavigationExtraComponents
          beachClubEnabled={!!features?.BeachClub}
          onNavItemClick={onNavItemClick}
        />
      }
    />
  )
}
