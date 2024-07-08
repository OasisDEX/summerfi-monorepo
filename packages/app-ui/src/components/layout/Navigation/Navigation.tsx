import { FC, ReactNode, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'

import {
  NavigationMenuPanelLinkType,
  NavigationMenuPanelType,
  WithNavigationModules,
} from '@/components/layout/Navigation/Navigation.types'
import { NavigationActions } from '@/components/layout/Navigation/NavigationActions'
import { NavigationBranding } from '@/components/layout/Navigation/NavigationBranding'
import { NavigationMenu } from '@/components/layout/Navigation/NavigationMenu'
import { NavigationMenuMobile } from '@/components/layout/Navigation/NavigationMenuMobile'
import { useClientSideMount } from '@/helpers/use-client-side-mount'

import navigationStyles from '@/components/layout/Navigation/Navigation.module.scss'

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
  const mountedOnClient = useClientSideMount()

  const toggleMobileMenu = () => {
    setMobileMenuOpened(!mobileMenuOpened)
  }

  return (
    mountedOnClient && (
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
  )
}
