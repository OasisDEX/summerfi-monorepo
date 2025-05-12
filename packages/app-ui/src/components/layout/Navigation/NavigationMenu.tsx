'use client'

import { useState } from 'react'
import {
  type NavigationMenuPanelLinkType,
  type NavigationMenuPanelType,
  type WithNavigationModules,
} from '@summerfi/app-types'

import { NavigationMenuDropdown } from '@/components/layout/Navigation/NavigationMenuDropdown'
import { NavigationMenuLink } from '@/components/layout/Navigation/NavigationMenuLink'
import { NavigationMenuPanel } from '@/components/layout/Navigation/NavigationMenuPanel'

import navigationMenuStyles from '@/components/layout/Navigation/NavigationMenu.module.css'

interface NavigationMenuProps extends WithNavigationModules {
  currentPath: string
  links?: NavigationMenuPanelLinkType[]
  panels?: NavigationMenuPanelType[]
}

export const NavigationMenu = ({
  links,
  panels,
  currentPath,
  navigationModules,
}: NavigationMenuProps): React.ReactNode => {
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false)
  const [isPanelSwitched, setIsPanelSwitched] = useState<boolean>(false)
  const [currentPanel, setCurrentPanel] = useState<string>(panels?.[0].label ?? '')
  const [arrowPosition, setArrowPosition] = useState<number>(0)

  function closeDropdown() {
    setIsPanelSwitched(false)
    setIsPanelOpen(false)
  }

  return (
    <div className={navigationMenuStyles.navigationMenu} onMouseLeave={() => closeDropdown()}>
      {((links && links.length > 0) ?? (panels && panels.length > 0)) && (
        <ul className={navigationMenuStyles.navigationMenuList}>
          {panels?.map((panel) => (
            <NavigationMenuPanel
              key={`panel-${panel.label}`}
              currentPanel={currentPanel}
              isPanelOpen={isPanelOpen}
              {...panel}
              onMouseEnter={(center) => {
                setIsPanelSwitched(isPanelOpen)
                setIsPanelOpen(true)
                setCurrentPanel(panel.label)
                setArrowPosition(center)
              }}
            />
          ))}
          {links?.map((link) => (
            <NavigationMenuLink
              key={`link-${link.label}`}
              {...link}
              currentPath={currentPath}
              onMouseEnter={() => closeDropdown()}
            />
          ))}
        </ul>
      )}
      {panels && panels.length > 0 && (
        <NavigationMenuDropdown
          arrowPosition={arrowPosition}
          currentPanel={currentPanel}
          isPanelOpen={isPanelOpen}
          isPanelSwitched={isPanelSwitched}
          panels={panels}
          navigationModules={navigationModules}
        />
      )}
    </div>
  )
}
