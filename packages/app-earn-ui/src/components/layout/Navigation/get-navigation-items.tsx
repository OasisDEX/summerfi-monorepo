import { type EarnNavigationProps } from '@/components/layout/Navigation/Navigation'
import { SupportBox } from '@/components/layout/Navigation/SupportBox'

export const getNavigationItems = ({
  userWalletAddress,
  isEarnApp,
}: {
  userWalletAddress?: string
  isEarnApp?: boolean
}): EarnNavigationProps['links'] => [
  {
    label: 'Earn',
    id: 'earn',
    link: !isEarnApp ? `/earn` : `/`,
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
    label: 'Explore',
    id: 'explore',
    itemsList: [
      {
        title: '$SUMR token',
        id: 'sumr',
        description: 'Claim your $SUMR tokens',
        url: `${!isEarnApp ? `/earn` : ``}/sumr`,
        icon: 'sumr',
        prefetchDisabled: !isEarnApp,
      },
      {
        url: `${!isEarnApp ? `/earn` : ``}/user-activity`,
        id: 'user-activity',
        title: 'User Activity',
        description: 'Transparent view of global user activity',
        icon: 'earn_user_activities',
        prefetchDisabled: !isEarnApp,
      },
      {
        url: `${!isEarnApp ? `/earn` : ``}/rebalance-activity`,
        id: 'rebalancing-activity',
        title: 'Rebalancing Activity',
        description: 'Vault optimizations performed by AI-powered keepers',
        icon: 'earn_rebalance_activities',
        prefetchDisabled: !isEarnApp,
      },
      // {
      //   url: '/yield-trend',
      //   id: 'yield-trend',
      //   title: 'Yield Trend',
      //   description: 'Compare median DeFi yield to Lazy Summer AI-Optimized Yield',
      //   icon: 'earn_yield_trend',
      // },
    ],
  },
  // hide for now until we provide all the necessary channels of support
  ...[
    {
      label: 'Support',
      id: 'support',
      dropdownContent: <SupportBox />,
    },
  ],
]
