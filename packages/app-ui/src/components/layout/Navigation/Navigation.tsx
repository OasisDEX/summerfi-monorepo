'use client'

import { type FC, type ReactNode, useState } from 'react'
import {
  type NavigationMenuPanelLinkType,
  type NavigationMenuPanelType,
  type WithNavigationModules,
} from '@summerfi/app-types'
import { useMediaQuery } from 'usehooks-ts'

import { NavigationActions } from '@/components/layout/Navigation/NavigationActions'
import { NavigationBranding } from '@/components/layout/Navigation/NavigationBranding'
import { NavigationMenu } from '@/components/layout/Navigation/NavigationMenu'
import { NavigationMenuMobile } from '@/components/layout/Navigation/NavigationMenuMobile'

import navigationStyles from '@/components/layout/Navigation/Navigation.module.css'

interface NavigationProps extends WithNavigationModules {
  currentPath: string
  logo: string
  logoSmall: string
  links?: NavigationMenuPanelLinkType[]
  panels?: NavigationMenuPanelType[]
  walletConnectionComponent?: ReactNode
  raysCountComponent?: ReactNode
  onLogoClick?: () => void
  additionalModule?: ReactNode
}

export const Navigation: FC<NavigationProps> = ({
  logo,
  logoSmall,
  links,
  panels,
  currentPath,
  raysCountComponent,
  walletConnectionComponent,
  navigationModules,
  onLogoClick,
  additionalModule,
}) => {
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false)
  const isViewBelowL = useMediaQuery(`(max-width: 1024px)`)

  const toggleMobileMenu = () => {
    setMobileMenuOpened(!mobileMenuOpened)
  }

  return (
    <div className={navigationStyles.wrapper}>
      <header className={navigationStyles.container}>
        <NavigationBranding logo={logo} logoSmall={logoSmall} onLogoClick={onLogoClick} />
        {isViewBelowL ? (
          <NavigationMenuMobile
            menuOpened={mobileMenuOpened}
            toggleMobileMenu={toggleMobileMenu}
            links={links}
            panels={panels}
            logo={logoSmall}
            navigationModules={navigationModules}
          />
        ) : (
          <NavigationMenu
            links={links}
            panels={panels}
            currentPath={currentPath}
            navigationModules={navigationModules}
          />
        )}
        <NavigationActions
          raysCountComponent={raysCountComponent}
          walletConnectionComponent={walletConnectionComponent}
          toggleMobileMenu={toggleMobileMenu}
        />
        {additionalModule}
      </header>
    </div>
  )
}
