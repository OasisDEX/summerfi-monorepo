'use client'

import { type FC, type ReactNode, useEffect, useState } from 'react'
import { type NavigationMenuPanelLinkType } from '@summerfi/app-types'

import { NavigationActions } from '@/components/layout/Navigation/NavigationActions'
import { NavigationBranding } from '@/components/layout/Navigation/NavigationBranding'
import { type NavigationItemsProps } from '@/components/layout/Navigation/NavigationItems'
import { NavigationMenu } from '@/components/layout/Navigation/NavigationMenu'
import { NavigationMenuMobile } from '@/components/layout/Navigation/NavigationMenuMobile'

import navigationStyles from '@/components/layout/Navigation/Navigation.module.scss'

export interface EarnNavigationProps {
  currentPath: string
  logo: string
  logoSmall: string
  links?: (Omit<NavigationMenuPanelLinkType, 'link' | 'onClick'> & {
    id: string
    itemsList?: NavigationItemsProps['items']
    dropdownContent?: ReactNode
    link?: string
    onClick?: () => void
  })[]
  walletConnectionComponent?: ReactNode
  signupComponent?: ReactNode
  onLogoClick?: () => void
}

export const Navigation: FC<EarnNavigationProps> = ({
  logo,
  logoSmall,
  links,
  currentPath,
  walletConnectionComponent,
  onLogoClick,
  signupComponent,
}) => {
  const [tempCurrentPath, setTempCurrentPath] = useState(currentPath)
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false)

  const toggleMobileMenu = () => {
    const nextValue = !mobileMenuOpened

    if (nextValue) {
      // mobile menu
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    setMobileMenuOpened(!mobileMenuOpened)
  }

  useEffect(() => {
    if (tempCurrentPath !== currentPath) {
      setTempCurrentPath(currentPath)
      setMobileMenuOpened(false)
      document.body.style.overflow = 'auto'
    }
  }, [currentPath, tempCurrentPath])

  return (
    <div className={navigationStyles.wrapper}>
      <header className={navigationStyles.container}>
        <NavigationBranding logo={logo} logoSmall={logoSmall} onLogoClick={onLogoClick} />
        <NavigationMenu links={links} currentPath={currentPath} />
        <NavigationActions
          walletConnectionComponent={walletConnectionComponent}
          toggleMobileMenu={toggleMobileMenu}
          signUpComponent={signupComponent}
        />
      </header>
      <NavigationMenuMobile
        logo={logo}
        links={links}
        currentPath={currentPath}
        mobileMenuOpened={mobileMenuOpened}
        toggleMobileMenu={toggleMobileMenu}
      />
    </div>
  )
}
