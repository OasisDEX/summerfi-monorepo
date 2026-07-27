import { type IconNamesList } from '@summerfi/app-types'

import { type EarnNavigationProps } from '@/components/layout/Navigation/Navigation'

export const getNavigationItems = ({
  userWalletAddress,
  isEarnApp = false,
  onNavItemClick,
  logIn,
}: {
  userWalletAddress?: string
  isEarnApp?: boolean
  onNavItemClick?: (params: { buttonName: string; isEarnApp?: boolean }) => void
  logIn?: () => Promise<string | undefined>
}): EarnNavigationProps['links'] => {
  const prefix = isEarnApp ? `` : `/earn`

  const handleButtonClick = (buttonName: string) => () => {
    onNavItemClick?.({ buttonName, isEarnApp })
  }

  const itemsListSumr = [
    {
      title: '$SUMR token',
      id: 'sumr',
      description: 'Learn about SUMR',
      url: `${prefix}/sumr`,
      icon: 'sumr' as IconNamesList,
      prefetchDisabled: !isEarnApp,
      onClick: handleButtonClick('sumr'),
    },
    {
      title: 'SUMR staking',
      id: 'sumr-stake',
      description: 'Stake SUMR and earn USDC',
      url: `${prefix}/staking`,
      icon: 'earn_staking' as IconNamesList,
      prefetchDisabled: !isEarnApp,
      onClick: handleButtonClick('sumr-stake'),
    },
    {
      title: 'Lazy Summer Forum',
      id: 'forum',
      description: 'Post and read governance discussions',
      url: `https://forum.summer.fi/`,
      target: '_blank',
      icon: 'earn_forum' as IconNamesList,
      prefetchDisabled: !isEarnApp,
      onClick: handleButtonClick('forum'),
    },
    {
      title: 'Lazy Summer Governance',
      id: 'governance',
      description: 'Vote on the latest proposals by the Lazy Summer DAO',
      url: `https://gov.summer.fi/dao`,
      target: '_blank',
      icon: 'earn_dao_governance' as IconNamesList,
      prefetchDisabled: !isEarnApp,
      onClick: handleButtonClick('governance'),
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
      onClick: handleButtonClick('email-support'),
    },
    {
      title: 'Join the Discord Community',
      id: 'join-discord-community',
      description: 'Get live help from the team and community',
      url: 'https://chat.summer.fi',
      target: '_blank',
      icon: 'earn_rebalance_activities' as IconNamesList,
      prefetchDisabled: !isEarnApp,
      onClick: handleButtonClick('join-discord-community'),
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
              handleButtonClick('portfolio')()
              await logIn().then((address) => {
                if (address) {
                  window.location.href = `/earn/portfolio/${address}`
                } else {
                  // If login fails or is cancelled, navigate to the generic portfolio page
                  window.location.href = `/earn/portfolio`
                }
              })
            }
          : handleButtonClick('portfolio'),
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
