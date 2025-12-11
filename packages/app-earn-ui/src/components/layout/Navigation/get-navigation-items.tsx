import { type EarnAppConfigType, type IconNamesList } from '@summerfi/app-types'

import { Text } from '@/components/atoms/Text/Text'
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
  const stakingV2Enabled = features?.StakingV2
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

  const sumrCategory = stakingV2Enabled
    ? [
        {
          label: '$SUMR',
          id: 'sumr-category',
          itemsList: [
            {
              title: 'Learn about $SUMR',
              id: 'sumr',
              description: 'Learn about SUMR tokenomics and view key stats.',
              url: `${prefix}/sumr`,
              icon: 'sumr' as IconNamesList,
              prefetchDisabled: !isEarnApp,
              onClick: handleButtonClick('sumr'),
            },
            {
              title: (
                <>
                  Stake $SUMR{' '}
                  <Text
                    variant="p4semi"
                    style={{
                      display: 'inline-block',
                      background: 'var(--gradient-earn-protocol-dark)',
                      position: 'relative',
                      top: '-2px',
                      padding: '0 8px',
                      borderRadius: '4px',
                      color: 'white',
                    }}
                  >
                    Staking V2
                  </Text>
                </>
              ),
              id: 'sumr-stake',
              description: 'Earn USD yield by staking your SUMR.',
              url: `${prefix}/staking`,
              icon: 'earn_user_activities' as IconNamesList,
              prefetchDisabled: !isEarnApp,
              onClick: handleButtonClick('sumr-stake'),
            },
            {
              title: 'Governance',
              id: 'governance',
              description: 'The onchain decisions shaping Lazy Summer Protocol ',
              url: `https://gov.summer.fi/dao`,
              target: '_blank',
              icon: 'earn_rebalance_activities' as IconNamesList,
              prefetchDisabled: !isEarnApp,
              onClick: handleButtonClick('governance'),
            },
          ],
        },
      ]
    : []

  const itemsListExplore = stakingV2Enabled
    ? [
        {
          url: `${prefix}/user-activity`,
          id: 'user-activity',
          title: 'User Activity',
          description: 'Transparent view of global user activity',
          icon: 'earn_user_activities' as IconNamesList,
          prefetchDisabled: !isEarnApp,
          onClick: handleButtonClick('user-activity'),
        },
        {
          url: `${prefix}/rebalance-activity`,
          id: 'rebalancing-activity',
          title: 'Rebalancing Activity',
          description: 'Vault optimizations performed by AI-powered keepers',
          icon: 'earn_rebalance_activities' as IconNamesList,
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
      ]
    : [
        {
          title: '$SUMR token',
          id: 'sumr',
          description: 'Claim your $SUMR tokens',
          url: `${prefix}/sumr`,
          icon: 'sumr' as IconNamesList,
          prefetchDisabled: !isEarnApp,
          onClick: handleButtonClick('sumr'),
        },
        {
          url: `${prefix}/user-activity`,
          id: 'user-activity',
          title: 'User Activity',
          description: 'Transparent view of global user activity',
          icon: 'earn_user_activities' as IconNamesList,
          prefetchDisabled: !isEarnApp,
          onClick: handleButtonClick('user-activity'),
        },
        {
          url: `${prefix}/rebalance-activity`,
          id: 'rebalancing-activity',
          title: 'Rebalancing Activity',
          description: 'Vault optimizations performed by AI-powered keepers',
          icon: 'earn_rebalance_activities' as IconNamesList,
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
      ]

  return [
    {
      label: 'Earn',
      id: 'earn',
      link: !isEarnApp ? `/earn` : `/`,
      prefetchDisabled: !isEarnApp,
      onClick: handleButtonClick('earn-app'),
    },
    ...portfolioLink,
    ...sumrCategory,
    {
      label: 'Explore',
      id: 'explore',
      itemsList: itemsListExplore,
    },
    {
      label: 'Support',
      id: 'support',
      dropdownContent: <SupportBox />,
      onClick: handleButtonClick('support'),
    },
  ]
}
