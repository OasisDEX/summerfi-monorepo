import { type IconNamesList } from '@summerfi/app-types'

import { type EarnNavigationProps } from '@/components/layout/Navigation/Navigation'

export const getNavigationItems = ({
  userWalletAddress,
  isEarnApp = false,
  logIn,
}: {
  userWalletAddress?: string
  isEarnApp?: boolean
  logIn?: () => Promise<string | undefined>
}): EarnNavigationProps['links'] => {
  const prefix = isEarnApp ? `` : `/earn`

  const itemsListSumr = [
    {
      title: '$SUMR token',
      id: 'sumr',
      description: 'Learn about SUMR',
      url: `${prefix}/sumr`,
      icon: 'sumr' as IconNamesList,
      prefetchDisabled: !isEarnApp,
    },
    {
      title: 'SUMR staking',
      id: 'sumr-stake',
      description: 'Stake SUMR and earn USDC',
      url: `${prefix}/staking`,
      icon: 'earn_staking' as IconNamesList,
      prefetchDisabled: !isEarnApp,
    },
    {
      title: 'Lazy Summer Forum',
      id: 'forum',
      description: 'Post and read governance discussions',
      url: `https://forum.summer.fi/`,
      target: '_blank',
      icon: 'earn_forum' as IconNamesList,
      prefetchDisabled: !isEarnApp,
    },
    {
      title: 'Lazy Summer Governance',
      id: 'governance',
      description: 'Vote on the latest proposals by the Lazy Summer DAO',
      url: `https://gov.summer.fi/dao`,
      target: '_blank',
      icon: 'earn_dao_governance' as IconNamesList,
      prefetchDisabled: !isEarnApp,
    },
  ]

  const itemsListSupport = [
    {
      title: 'Email support',
      id: 'email-support',
      description: 'For all general purpose support questions',
      url: 'mailto:support@summer.fi',
      icon: 'sumr' as IconNamesList,
      prefetchDisabled: !isEarnApp,
    },
    {
      title: 'Join the Discord Community',
      id: 'join-discord-community',
      description: 'Get live help from the team and community',
      url: 'https://chat.summer.fi',
      target: '_blank',
      icon: 'earn_rebalance_activities' as IconNamesList,
      prefetchDisabled: !isEarnApp,
    },
  ]

  const finalLinksArray = [
    {
      label: 'Portfolio',
      id: 'portfolio',
      link: userWalletAddress
        ? `${prefix}/portfolio/${userWalletAddress ? userWalletAddress : ''}`
        : !logIn
          ? `${prefix}/portfolio/`
          : undefined,
      onClick:
        logIn && !userWalletAddress
          ? async () => {
              await logIn().then((address) => {
                if (address) {
                  window.location.href = `/earn/portfolio/${address}`
                } else {
                  // If login fails or is cancelled, navigate to the generic portfolio page
                  window.location.href = `/earn/portfolio`
                }
              })
            }
          : undefined,
    },
    {
      label: '$SUMR',
      id: 'sumr-category',
      style: {
        color: 'var(--color-background-primary)',
      },
      itemsList: itemsListSumr,
    },
    {
      label: 'Support',
      id: 'support',
      itemsList: itemsListSupport,
    },
  ]

  return finalLinksArray
}
