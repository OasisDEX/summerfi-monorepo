'use client'

import { FC } from 'react'
import { Navigation } from '@summerfi/app-ui'
import {
  NavigationMenuPanelLinkType,
  NavigationMenuPanelType,
} from '@summerfi/app-ui/dist/types/src/components/layout/Navigation/Navigation.types'
import { usePathname } from 'next/navigation'

interface NavigationWrapperProps {
  links?: NavigationMenuPanelLinkType[]
  panels?: NavigationMenuPanelType[]
}

export const NavigationWrapper: FC<NavigationWrapperProps> = ({ links, panels }) => {
  const currentPath = usePathname()

  return (
    <Navigation
      currentPath={currentPath}
      logo="img/branding/logo-dark.svg"
      logoSmall="img/branding/dot-dark.svg"
      links={links}
      panels={panels}
    />
  )
}
