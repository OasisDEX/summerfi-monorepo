import { useState } from 'react'
import {
  type NavigationMenuPanelLinkType,
  type NavigationMenuPanelType,
  type WithNavigationModules,
} from '@summerfi/app-types'
import { IconX } from '@tabler/icons-react'
import clsx from 'clsx'
import Image from 'next/image'

import { NavigationMobileMenuPanel } from '@/components/layout/Navigation/NavigationMobileMenuPanel'

import navigationMenuMobileStyles from './NavigationMenuMobile.module.scss'

interface NavigationMenuMobileProps extends WithNavigationModules {
  menuOpened: boolean
  toggleMobileMenu: () => void
  links?: NavigationMenuPanelLinkType[]
  panels?: NavigationMenuPanelType[]
  logo: string
}

export const NavigationMenuMobile = ({
  menuOpened,
  toggleMobileMenu,
  logo,
  links,
  panels,
  navigationModules,
}: NavigationMenuMobileProps): React.ReactNode => {
  const [openNestedMenu, setOpenNestedMenu] = useState<[string, number, number]>()

  return (
    <div
      className={clsx(navigationMenuMobileStyles.navigationMenuMobileWrapper, {
        [navigationMenuMobileStyles.navigationMenuMobileWrapperActive]: menuOpened,
      })}
    >
      <div className={navigationMenuMobileStyles.navigationMenuMobileHeader}>
        <div style={{ width: '32px', height: '32px', position: 'relative' }}>
          <Image src={logo} fill alt="Summer.fi Logo" />
        </div>
        <IconX
          onClick={() => {
            toggleMobileMenu()
            setOpenNestedMenu(undefined)
          }}
          strokeWidth={3}
        />
      </div>
      {((links && links.length > 0) ?? (panels && panels.length > 0)) && (
        <ul className={navigationMenuMobileStyles.navigationMenuMobileUl}>
          {panels?.map((panel) => (
            <NavigationMobileMenuPanel
              key={`panel-mobile-${panel.label}`}
              isOpen={menuOpened}
              onOpenNestedMenu={setOpenNestedMenu}
              openNestedMenu={openNestedMenu}
              navigationModules={navigationModules}
              {...panel}
            />
          ))}
          {/* 
            {links?.map((link) => (
              <NavigationMobileMenuLink key={`link-${link.label}`} {...link} />
            ))} */}
        </ul>
      )}
    </div>
  )
}
