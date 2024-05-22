'use client'

/* eslint-disable no-magic-numbers */
import { useState } from 'react'
import classNames from 'classNames'
import Link from 'next/link'

import { Text } from '@/components/atoms/Text/Text'
import {
  NavigationMenuPanelLinkProps,
  NavigationMenuPanelLinkType,
  NavigationMenuPanelProps,
  NavigationMenuPanelType,
} from '@/components/layout/Navigation/Navigation.types'

import navigationMenuStyles from '@/components/layout/Navigation/NavigationMenu.module.scss'

interface NavigationMenuProps {
  currentPath: string
  links?: NavigationMenuPanelLinkType[]
  panels?: NavigationMenuPanelType[]
}

function NavigationMenuLink({
  label,
  link,
  onClick,
  onMouseEnter,
  currentPath,
}: NavigationMenuPanelLinkProps) {
  return (
    <li className={navigationMenuStyles.navigationMenuLink} onMouseEnter={onMouseEnter}>
      {link && (
        <Link
          href={link}
          className={classNames(navigationMenuStyles.navigationMenuLinkElement, {
            [navigationMenuStyles.navigationMenuLinkElementActive]: currentPath === link,
          })}
        >
          {label}
        </Link>
      )}
      {onClick && (
        <Text
          as="span"
          variant="p3semi"
          onClick={onClick}
          className={navigationMenuStyles.navigationMenuLinkElementOnClick}
        >
          {label}
        </Text>
      )}
    </li>
  )
}

function NavigationMenuPanelLabel({
  currentPanel,
  label,
  isPanelOpen,
}: Pick<NavigationMenuPanelProps, 'currentPanel' | 'label' | 'isPanelOpen'>) {
  return (
    <Text
      as="span"
      variant="p1semi"
      className={classNames(navigationMenuStyles.navigationMenuPanelLabel, {
        [navigationMenuStyles.navigationMenuPanelLabelActive]:
          isPanelOpen && currentPanel === label,
      })}
    >
      {label}
    </Text>
  )
}

function NavigationMenuPanel({
  currentPanel,
  label,
  url,
  isPanelOpen,
  onMouseEnter,
}: NavigationMenuPanelProps) {
  return (
    <li
      className={navigationMenuStyles.navigationMenuPanel}
      onMouseEnter={(e) => {
        const target = e.target as HTMLDivElement

        onMouseEnter((target.offsetLeft + target.offsetWidth) / 2)
      }}
    >
      {url ? (
        <Link href={url}>
          <NavigationMenuPanelLabel
            currentPanel={currentPanel}
            label={label}
            isPanelOpen={isPanelOpen}
          />
        </Link>
      ) : (
        <NavigationMenuPanelLabel
          currentPanel={currentPanel}
          label={label}
          isPanelOpen={isPanelOpen}
        />
      )}
    </li>
  )
}

export const NavigationMenu = ({ links, panels, currentPath }: NavigationMenuProps) => {
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
    </div>
  )
}
