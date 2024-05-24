'use client'

import { FC } from 'react'
import { Navigation, NavigationMenuPanelType } from '@summerfi/app-ui'
import { usePathname } from 'next/navigation'

interface NavigationWrapperProps {
  panels?: NavigationMenuPanelType[]
}

export const NavigationWrapper: FC<NavigationWrapperProps> = ({ panels }) => {
  const currentPath = usePathname()

  return (
    <Navigation
      currentPath={currentPath}
      logo="img/branding/logo-dark.svg"
      logoSmall="img/branding/dot-dark.svg"
      links={[
        {
          label: 'Portfolio',
          link: '/#',
        },
      ]}
      panels={panels}
    />
  )
}
