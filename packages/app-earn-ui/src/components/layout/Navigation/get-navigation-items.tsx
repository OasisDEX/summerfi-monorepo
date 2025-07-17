import { type EarnAppConfigType, type IconNamesList } from '@summerfi/app-types'

import { type EarnNavigationProps } from '@/components/layout/Navigation/Navigation'
import { SupportBox } from '@/components/layout/Navigation/SupportBox'

export const getNavigationItems = ({
  userWalletAddress,
  isEarnApp = false,
  features,
}: {
  userWalletAddress?: string
  isEarnApp?: boolean
  features?: EarnAppConfigType['features']
}): EarnNavigationProps['links'] => {
  const prefix = !isEarnApp ? `/earn` : ``
  const institutionsEnabled = features?.Institutions
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : ''

  const portfolioLink = userWalletAddress
    ? [
        {
          label: 'Portfolio',
          id: 'portfolio',
          link: `${prefix}/portfolio/${userWalletAddress}`,
        },
      ]
    : []

  return [
    {
      label: 'Earn',
      id: 'earn',
      link: !isEarnApp ? `/earn` : `/`,
      prefetchDisabled: !isEarnApp,
    },
    ...portfolioLink,
    {
      label: 'Explore',
      id: 'explore',
      itemsList: [
        {
          title: '$SUMR token',
          id: 'sumr',
          description: 'Claim your $SUMR tokens',
          url: `${prefix}/sumr`,
          icon: 'sumr',
          prefetchDisabled: !isEarnApp,
        },
        {
          url: `${prefix}/user-activity`,
          id: 'user-activity',
          title: 'User Activity',
          description: 'Transparent view of global user activity',
          icon: 'earn_user_activities',
          prefetchDisabled: !isEarnApp,
        },
        {
          url: `${prefix}/rebalance-activity`,
          id: 'rebalancing-activity',
          title: 'Rebalancing Activity',
          description: 'Vault optimizations performed by AI-powered keepers',
          icon: 'earn_rebalance_activities',
          prefetchDisabled: !isEarnApp,
        },
        ...(institutionsEnabled
          ? [
              {
                // `currentOrigin` is special case for institutions - it is always on the main domain (LP)
                url: `${currentOrigin}/institutions`,
                id: 'institutions',
                title: 'Institutions',
                description: 'Crypto native yield, for forward thinking institutions',
                icon: 'earn_institution' as IconNamesList,
                prefetchDisabled: !isEarnApp,
              },
            ]
          : []),
        // {
        //   url: `${prefix}/yield-trend`,
        //   id: 'yield-trend',
        //   title: 'Yield Trend',
        //   description: 'Compare median DeFi yield to Lazy Summer AI-Optimized Yield',
        //   icon: 'earn_yield_trend',
        // },
      ],
    },
    {
      label: 'Support',
      id: 'support',
      dropdownContent: <SupportBox />,
    },
  ]
}
