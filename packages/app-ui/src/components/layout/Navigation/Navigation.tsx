import { FC } from 'react'

import {
  NavigationMenuPanelLinkType,
  NavigationMenuPanelType,
  WithNavigationModules,
} from '@/components/layout/Navigation/Navigation.types'
import { NavigationActions } from '@/components/layout/Navigation/NavigationActions'
import { NavigationBranding } from '@/components/layout/Navigation/NavigationBranding'
import { NavigationMenu } from '@/components/layout/Navigation/NavigationMenu'

import navigationStyles from '@/components/layout/Navigation/Navigation.module.scss'

interface NavigationProps extends WithNavigationModules {
  currentPath: string
  logo: string
  logoSmall: string
  links?: NavigationMenuPanelLinkType[]
  panels?: NavigationMenuPanelType[]
  walletConnectionComponent?: React.ReactNode
}

export const Navigation: FC<NavigationProps> = ({
  logo,
  logoSmall,
  links,
  panels,
  currentPath,
  walletConnectionComponent,
  navigationModules,
}) => {
  return (
    <div className={navigationStyles.wrapper}>
      <header className={navigationStyles.container}>
        <NavigationBranding logo={logo} logoSmall={logoSmall} />
        <NavigationMenu
          links={links}
          panels={panels}
          currentPath={currentPath}
          navigationModules={navigationModules}
        />
        <NavigationActions walletConnectionComponent={walletConnectionComponent} />
      </header>
    </div>
  )
}
