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
    label: '$SUMR',
    id: 'sumr',
    link: `/earn/sumr`,
  },
  {
    label: 'Explore',
    id: 'explore',
    itemsList: [
      {
        url: '/earn/user-activity',
        id: 'user-activity',
        title: 'User Activity',
        description: 'Transparent view of global user activity',
        icon: 'earn_user_activities',
      },
      {
        url: '/earn/rebalance-activity',
        id: 'rebalancing-activity',
        title: 'Rebalancing Activity',
        description: 'Vault optimizations performed by AI-powered keepers',
        icon: 'earn_rebalance_activities',
      },
      {
        url: '/yield-trend',
        id: 'yield-trend',
        title: 'Yield Trend',
        description: 'Compare median DeFi yield to Lazy Summer AI-Optimized Yield',
        icon: 'earn_yield_trend',
      },
    ],
  },
  {
    label: 'Support',
    id: 'support',
    dropdownContent: <SupportBox />,
  },
]
