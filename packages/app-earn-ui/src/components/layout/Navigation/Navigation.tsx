'use client'

import { type FC, type ReactNode, useState } from 'react'
import { type NavigationMenuPanelLinkType } from '@summerfi/app-types'
import { useMediaQuery } from 'usehooks-ts'

import { NavigationActions } from '@/components/layout/Navigation/NavigationActions'
import { NavigationBranding } from '@/components/layout/Navigation/NavigationBranding'
import { NavigationMenu } from '@/components/layout/Navigation/NavigationMenu'
import { NavigationMenuMobile } from '@/components/layout/Navigation/NavigationMenuMobile'

import navigationStyles from '@/components/layout/Navigation/Navigation.module.scss'

export interface EarnNavigationProps {
  currentPath: string
  logo: string
  logoSmall: string
  links?: (Omit<NavigationMenuPanelLinkType, 'link' | 'onClick'> & {
    id: string
    dropdownContent?: ReactNode
    link?: string
    onClick?: () => void
  })[]
  walletConnectionComponent?: ReactNode
  raysCountComponent?: ReactNode
  onLogoClick?: () => void
  additionalModule?: ReactNode
}

export const Navigation: FC<EarnNavigationProps> = ({
  logo,
  logoSmall,
  links,
  currentPath,
  raysCountComponent,
  walletConnectionComponent,
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
          <NavigationMenuMobile />
        ) : (
          <NavigationMenu links={links} currentPath={currentPath} />
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
