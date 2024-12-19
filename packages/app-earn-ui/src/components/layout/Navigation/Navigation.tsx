'use client'

import { type FC, type ReactNode, useEffect, useState } from 'react'
import { type NavigationMenuPanelLinkType } from '@summerfi/app-types'

import { NavigationActions } from '@/components/layout/Navigation/NavigationActions'
import { NavigationBranding } from '@/components/layout/Navigation/NavigationBranding'
import { type NavigationItemsProps } from '@/components/layout/Navigation/NavigationItems'
import { NavigationMenu } from '@/components/layout/Navigation/NavigationMenu'
import { NavigationMenuMobile } from '@/components/layout/Navigation/NavigationMenuMobile'
import {
  MobileDrawer,
  MobileDrawerDefaultWrapper,
} from '@/components/molecules/MobileDrawer/MobileDrawer'
import { useMobileCheck } from '@/hooks/use-mobile-check'

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
  configComponent?: ReactNode
  signupComponent?: ReactNode
  onLogoClick?: () => void
}

export const Navigation: FC<EarnNavigationProps> = ({
  logo,
  logoSmall,
  links,
  currentPath,
  walletConnectionComponent,
  configComponent,
  onLogoClick,
  signupComponent,
}) => {
  const [tempCurrentPath, setTempCurrentPath] = useState(currentPath)
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false)
  const { isMobile } = useMobileCheck()

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
          signUpComponent={signupComponent}
          toggleMobileMenu={toggleMobileMenu}
          configComponent={configComponent}
        />
      </header>
      {isMobile && (
        <MobileDrawer
          isOpen={mobileMenuOpened}
          onClose={() => setMobileMenuOpened(false)}
          slideFrom="top"
          height="auto"
          variant="default"
          zIndex={1001}
          style={{ backgroundColor: 'unset' }}
        >
          <MobileDrawerDefaultWrapper slideFrom="top">
            <NavigationMenuMobile
              logo={logoSmall}
              links={links}
              currentPath={currentPath}
              toggleMobileMenu={toggleMobileMenu}
              walletConnectionComponent={walletConnectionComponent}
              signUpComponent={signupComponent}
            />
          </MobileDrawerDefaultWrapper>
        </MobileDrawer>
      )}
    </div>
  )
}
