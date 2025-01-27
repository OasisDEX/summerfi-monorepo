import { type EarnNavigationProps } from '@/components/layout/Navigation/Navigation'
import { SupportBox } from '@/components/layout/Navigation/SupportBox'

export const getNavigationItems = ({
  userWalletAddress,
  isEarnApp,
  isFullyLaunched,
}: {
  userWalletAddress?: string
  isEarnApp?: boolean
  isFullyLaunched?: boolean
}): EarnNavigationProps['links'] => [
  {
    label: 'Earn',
    id: 'earn',
    link: !isEarnApp ? `/earn` : `/`,
    disabled: !isFullyLaunched,
  },
  ...(userWalletAddress
    ? [
        {
          label: 'Portfolio',
          id: 'portfolio',
          link: `${!isEarnApp ? `/earn` : ``}/portfolio/${userWalletAddress}`,
        },
      ]
    : []),
  {
    label: '$SUMR',
    id: 'sumr',
    link: `${!isEarnApp ? `/earn` : ``}/sumr`,
  },
  {
    label: 'Explore',
    id: 'explore',
    disabled: !isFullyLaunched,
    itemsList: [
      {
        url: `${!isEarnApp ? `/earn` : ``}/user-activity`,
        id: 'user-activity',
        title: 'User Activity',
        description: 'Transparent view of global user activity',
        icon: 'earn_user_activities',
      },
      {
        url: `${!isEarnApp ? `/earn` : ``}/rebalance-activity`,
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
