'use client'

import { type FC } from 'react'
import { Button, Navigation, NavigationExplore, SupportBox } from '@summerfi/app-earn-ui'
import { usePathname } from 'next/navigation'

export const NavigationWrapper: FC = () => {
  const currentPath = usePathname()

  return (
    <Navigation
      currentPath={currentPath}
      logo="/img/branding/logo-dark.svg"
      logoSmall="/img/branding/dot-dark.svg"
      links={[
        {
          label: 'Earn',
          id: 'earn',
          link: `/earn`,
        },
        {
          label: 'Explore',
          id: 'explore',
          dropdownContent: (
            <NavigationExplore
              items={[
                {
                  url: '/user-activity',
                  id: 'user-activity',
                  title: 'User activity',
                  description: 'Text for user activity',
                  icon: 'user',
                  iconSize: 18,
                },
                {
                  url: '/rebalancing-activity',
                  id: 'rebalancing-activity',
                  title: 'Rebalancing activity',
                  description: 'Text for rebalancing activity',
                  icon: 'rebalancing',
                },
              ]}
            />
          ),
        },
        {
          label: 'Support',
          id: 'support',
          dropdownContent: <SupportBox />,
        },
      ]}
      walletConnectionComponent={
        <Button variant="secondarySmall" onClick={() => {}}>
          Action!
        </Button>
      }
      onLogoClick={() => {
        // because router will use base path...
        window.location.href = '/'
      }}
    />
  )
}
