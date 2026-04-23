import { type EarnAppConfigType, type IconNamesList } from '@summerfi/app-types'

import { type EarnNavigationProps } from '@/components/layout/Navigation/Navigation'

export const getNavigationItems = ({
  userWalletAddress,
  isEarnApp = false,
  features: _features,
  onNavItemClick,
  logIn,
}: {
  userWalletAddress?: string
  isEarnApp?: boolean
  features?: EarnAppConfigType['features']
  onNavItemClick?: (params: { buttonName: string; isEarnApp?: boolean }) => void
  logIn?: () => Promise<string | undefined>
}): EarnNavigationProps['links'] => {
  const prefix = !isEarnApp ? `/earn` : ``
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : ''

  const handleButtonClick = (buttonName: string) => () => {
    onNavItemClick?.({ buttonName, isEarnApp })
  }

  const itemsListProducts = [
    {
      url: !isEarnApp ? `/permissionless-vaults` : `${currentOrigin}/permissionless-vaults`,
      id: 'products',
      title: 'Permissionless DeFi Vaults',
      description: "Get automated exposure to DeFi's highest quality yield",
      icon: 'earn_defi_vault' as IconNamesList,
      prefetchDisabled: !isEarnApp,
      onClick: handleButtonClick('products'),
    },
    {
      url: !isEarnApp ? `/permissioned-vaults` : `${currentOrigin}/permissioned-vaults`,
      id: 'permissioned-vaults',
      title: 'Permissioned RWA Vaults',
      description: 'Instant access to a selection of RWA private markets',
      icon: 'earn_defi_vault_eth' as IconNamesList,
      prefetchDisabled: !isEarnApp,
      onClick: handleButtonClick('permissioned-vaults'),
    },
    {
      url: !isEarnApp ? `/build-your-own-vault` : `${currentOrigin}/build-your-own-vault`,
      id: 'build-your-own-vault',
      title: 'Build your own Vault',
      description: 'Institutional Vault infrastructure to design your own Vault',
      icon: 'earn_custom_vaults' as IconNamesList,
      prefetchDisabled: !isEarnApp,
      onClick: handleButtonClick('build-your-own-vault'),
    },
    {
      url: !isEarnApp ? `/integrations` : `${currentOrigin}/integrations`,
      id: 'integrate-lazy-summer-protocol',
      title: 'Integrate the Lazy Summer Protocol',
      description: 'Give your users access the best yields, effortlessly',
      icon: 'earn_integrations' as IconNamesList,
      prefetchDisabled: !isEarnApp,
      onClick: handleButtonClick('integrate-lazy-summer-protocol'),
    },
  ]

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

  const itemsListExplore = [
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
    {
      // `currentOrigin` is special case for institutions - it is always on the main domain (LP)
      url: !isEarnApp ? `/team` : `${currentOrigin}/team`,
      id: 'team',
      title: 'Team',
      description: 'Leadership that’s helped shape DeFi from day 1',
      icon: 'earn_1_on_1' as IconNamesList,
      prefetchDisabled: !isEarnApp,
      onClick: handleButtonClick('team'),
    },
  ]

  const itemsListSupport = [
    {
      title: 'Email support',
      id: 'email-support',
      description: 'For all general purpose support questions',
      url: '#',
      icon: 'sumr' as IconNamesList,
      onClick: handleButtonClick('email-support'),
    },
    {
      title: 'Institutional sales and support',
      id: 'institutional-sales-and-support',
      description: 'Connect with a member of the Summer.fi institutional team',
      url: '#',
      icon: 'earn_institution' as IconNamesList,
      onClick: handleButtonClick('institutional-sales-and-support'),
    },
    {
      title: 'Join the Discord Community',
      id: 'join-discord-community',
      description: 'Get live help from the team and community',
      url: 'https://discord.com/invite/summerfi',
      target: '_blank',
      icon: 'earn_rebalance_activities' as IconNamesList,
      onClick: handleButtonClick('join-discord-community'),
    },
  ]

  const finalLinksArray = [
    {
      label: 'Products',
      id: 'products',
      itemsList: itemsListProducts,
    },
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
      label: 'Explore',
      id: 'explore',
      itemsList: itemsListExplore,
    },
    {
      label: 'Support',
      id: 'support',
      itemsList: itemsListSupport,
    },
  ]

  return finalLinksArray
}
