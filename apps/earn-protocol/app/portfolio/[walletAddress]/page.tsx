import { TabBarSSR } from '@summerfi/app-earn-ui'
import { unstable_cache } from 'next/cache'

import { portfolioWalletAssetsHandler } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { portfolioBulkRequest } from '@/app/server-handlers/portfolio-bulk-request/portfolio-bulk-request'
import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getSumrDelegatesWithDecayFactor } from '@/app/server-handlers/sumr-delegates-with-decay-factor'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { getSumrToClaim } from '@/app/server-handlers/sumr-to-claim'
import { PortfolioPageView } from '@/components/layout/PortfolioPageView/PortfolioPageView'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import {
  PortfolioOverviewWrapped,
  PortfolioRebalanceActivityWrapped,
  PortfolioRewardsWrapped,
  PortfolioWalletWrapped,
  PortfolioYourActivityWrapped,
} from '@/features/portfolio/components/PortfolioWrappedComponents'
import { PortfolioTabs } from '@/features/portfolio/types'

type PortfolioPageProps = {
  params: Promise<{
    walletAddress: string
  }>
  searchParams: Promise<{
    tab: PortfolioTabs
  }>
}

const PortfolioPage = async ({ params, searchParams }: PortfolioPageProps) => {
  const { walletAddress: walletAddressRaw } = await params
  const { tab } = await searchParams

  const walletAddress = walletAddressRaw.toLowerCase()

  const [
    walletData,
    sumrStakeDelegate,
    sumrBalances,
    sumrStakingInfo,
    { sumrDelegates, sumrDecayFactors },
    sumrToClaim,
    { positionsList },
  ] = await Promise.all([
    unstable_cache(portfolioWalletAssetsHandler, [walletAddress])(walletAddress),
    unstable_cache(getSumrDelegateStake, [walletAddress])({ walletAddress }),
    unstable_cache(getSumrBalances, [walletAddress])({ walletAddress }),
    unstable_cache(getSumrStakingInfo, [walletAddress])(),
    unstable_cache(getSumrDelegatesWithDecayFactor, [walletAddress])(),
    unstable_cache(getSumrToClaim, [walletAddress])({ walletAddress }),
    unstable_cache(portfolioBulkRequest, [walletAddress])({ walletAddress }),
  ])

  const rewardsData: ClaimDelegateExternalData = {
    sumrToClaim,
    sumrBalances,
    sumrStakeDelegate,
    sumrStakingInfo,
    sumrDelegates,
    sumrDecayFactors,
  }

  const portfolioTabElement = {
    [PortfolioTabs.OVERVIEW]: <PortfolioOverviewWrapped walletAddress={walletAddress} />,
    [PortfolioTabs.WALLET]: <PortfolioWalletWrapped walletAddress={walletAddress} />,
    [PortfolioTabs.REBALANCE_ACTIVITY]: (
      <PortfolioRebalanceActivityWrapped walletAddress={walletAddress} />
    ),
    [PortfolioTabs.YOUR_ACTIVITY]: <PortfolioYourActivityWrapped walletAddress={walletAddress} />,
    [PortfolioTabs.REWARDS]: <PortfolioRewardsWrapped walletAddress={walletAddress} />,
  }[tab]

  return (
    <PortfolioPageView
      positions={positionsList}
      walletAddress={walletAddress}
      walletData={walletData}
      rewardsData={rewardsData}
      tabs={
        <TabBarSSR
          selectedTab={tab}
          urlBase={`/portfolio/${walletAddressRaw}`}
          tabs={[
            {
              id: PortfolioTabs.OVERVIEW,
              label: 'Overview',
            },
            {
              id: PortfolioTabs.WALLET,
              label: 'Wallet',
            },
            {
              id: PortfolioTabs.YOUR_ACTIVITY,
              label: 'Your Activity',
            },
            {
              id: PortfolioTabs.REBALANCE_ACTIVITY,
              label: 'Rebalance Activity',
            },
            {
              id: PortfolioTabs.REWARDS,
              label: '$SUMR Rewards',
            },
          ]}
        />
      }
    >
      {portfolioTabElement}
    </PortfolioPageView>
  )
}

export default PortfolioPage
