import { type EarnNavigationProps } from '@/components/layout/Navigation/Navigation'
import { SupportBox } from '@/components/layout/Navigation/SupportBox'

export const getNavigationItems = ({
  userWalletAddress,
}: {
  userWalletAddress?: string
}): EarnNavigationProps['links'] => [
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
        title: 'User Activity',
        description: 'Transparent view of global user activity',
        icon: 'user',
        iconSize: 18,
      },
      {
        url: '/earn/rebalance-activity',
        id: 'rebalancing-activity',
        title: 'Rebalancing Activity',
        description: 'Vault optimizations performed by AI-powered keepers',
        icon: 'rebalancing',
      },
      {
        url: '/yield-trend',
        id: 'yield-trend',
        title: 'Yield Trend',
        description: 'Compare median DeFi yield to Lazy Summer AI-Optimized Yield',
        icon: 'rebalancing',
      },
    ],
  },
  {
    label: 'Support',
    id: 'support',
    dropdownContent: <SupportBox />,
  },
]
