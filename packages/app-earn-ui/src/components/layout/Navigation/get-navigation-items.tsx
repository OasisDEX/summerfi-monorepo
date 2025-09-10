import { type EarnAppConfigType, type IconNamesList } from '@summerfi/app-types'

import { type EarnNavigationProps } from '@/components/layout/Navigation/Navigation'
import { SupportBox } from '@/components/layout/Navigation/SupportBox'

export const getNavigationItems = ({
  userWalletAddress,
  isEarnApp = false,
  features,
  onNavItemClick,
}: {
  userWalletAddress?: string
  isEarnApp?: boolean
  features?: EarnAppConfigType['features']
  onNavItemClick?: (params: { buttonName: string; isEarnApp?: boolean }) => void
}): EarnNavigationProps['links'] => {
  const prefix = !isEarnApp ? `/earn` : ``
  const institutionsEnabled = features?.Institutions
  const teamPageEnabled = features?.Team
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : ''

  const handleButtonClick = (buttonName: string) => () => {
    onNavItemClick?.({ buttonName, isEarnApp })
  }

  const portfolioLink = userWalletAddress
    ? [
        {
          label: 'Portfolio',
          id: 'portfolio',
          link: `${prefix}/portfolio/${userWalletAddress}`,
          onClick: handleButtonClick('portfolio'),
        },
      ]
    : []

  return [
    {
      label: 'Earn',
      id: 'earn',
      link: !isEarnApp ? `/earn` : `/`,
      prefetchDisabled: !isEarnApp,
      onClick: handleButtonClick('earn-app'),
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
          onClick: handleButtonClick('sumr'),
        },
        {
          url: `${prefix}/user-activity`,
          id: 'user-activity',
          title: 'User Activity',
          description: 'Transparent view of global user activity',
          icon: 'earn_user_activities',
          prefetchDisabled: !isEarnApp,
          onClick: handleButtonClick('user-activity'),
        },
        {
          url: `${prefix}/rebalance-activity`,
          id: 'rebalancing-activity',
          title: 'Rebalancing Activity',
          description: 'Vault optimizations performed by AI-powered keepers',
          icon: 'earn_rebalance_activities',
          prefetchDisabled: !isEarnApp,
          onClick: handleButtonClick('rebalancing-activity'),
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
                onClick: handleButtonClick('institutions'),
              },
            ]
          : []),
        ...(teamPageEnabled
          ? [
              {
                // `currentOrigin` is special case for institutions - it is always on the main domain (LP)
                url: `${currentOrigin}/team`,
                id: 'team',
                title: 'Team',
                description: 'Leadership that’s helped shape DeFi from day 1',
                icon: 'earn_1_on_1' as IconNamesList,
                prefetchDisabled: !isEarnApp,
                onClick: handleButtonClick('team'),
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
      onClick: handleButtonClick('support'),
    },
  ]
}
