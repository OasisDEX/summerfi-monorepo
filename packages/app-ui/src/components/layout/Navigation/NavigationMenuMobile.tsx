import { useState } from 'react'
import { IconX } from '@tabler/icons-react'
import classNames from 'classnames'
import Image from 'next/image'

import {
  NavigationMenuPanelLinkType,
  NavigationMenuPanelType,
} from '@/components/layout/Navigation/Navigation.types'
import { NavigationMobileMenuPanel } from '@/components/layout/Navigation/NavigationMobileMenuPanel'

import navigationMenuMobileStyles from './NavigationMenuMobile.module.scss'

interface NavigationMenuMobileProps {
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
}: NavigationMenuMobileProps) => {
  const [openNestedMenu, setOpenNestedMenu] = useState<[string, number, number]>()

  return (
    <div
      className={classNames(navigationMenuMobileStyles.navigationMenuMobileWrapper, {
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