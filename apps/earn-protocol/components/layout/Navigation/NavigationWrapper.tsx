'use client'

import { type FC } from 'react'
import { Button, Navigation, SkeletonLine, SupportBox } from '@summerfi/app-earn-ui'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

import { NavConfig } from '@/features/nav-config/components/NavConfig/NavConfig'
import { useUserWallet } from '@/hooks/use-user-wallet'

const WalletLabel = dynamic(() => import('../../molecules/WalletLabel/WalletLabel'), {
  ssr: false,
  loading: () => (
    <Button variant="secondarySmall">
      <SkeletonLine width={100} height={10} style={{ opacity: 0.2 }} />
    </Button>
  ),
})

export const NavigationWrapper: FC = () => {
  const currentPath = usePathname()
  const { userWalletAddress } = useUserWallet()

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
        ...(userWalletAddress
          ? [
              {
                label: 'Portfolio',
                id: 'portfolio',
                link: `/earn/portfolio/${userWalletAddress}`,
              },
            ]
          : []),
        {
          label: 'Explore',
          id: 'explore',
          itemsList: [
            {
              url: '/earn/user-activity',
              id: 'user-activity',
              title: 'User activity',
              description: 'Text for user activity',
              icon: 'user',
              iconSize: 18,
            },
            {
              url: '/earn/rebalance-activity',
              id: 'rebalancing-activity',
              title: 'Rebalancing Activity',
              description: 'Text for rebalancing activity',
              icon: 'rebalancing',
            },
            {
              url: '/yield-trend',
              id: 'yield-trend',
              title: 'Yield Trend',
              description: 'Text for rebalancing activity',
              icon: 'rebalancing',
            },
          ],
        },
        {
          label: 'Support',
          id: 'support',
          dropdownContent: <SupportBox />,
        },
      ]}
      walletConnectionComponent={<WalletLabel />}
      configComponent={<NavConfig />}
      onLogoClick={() => {
        // because router will use base path...
        window.location.href = '/'
      }}
    />
  )
}
