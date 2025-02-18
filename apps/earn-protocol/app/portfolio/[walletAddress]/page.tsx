import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { unstable_cache as unstableCache } from 'next/cache'

import { fetchRaysLeaderboard } from '@/app/server-handlers/leaderboard'
import { portfolioWalletAssetsHandler } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { portfolioBulkRequest } from '@/app/server-handlers/portfolio-bulk-request/portfolio-bulk-request'
import { getGlobalRebalances } from '@/app/server-handlers/sdk/get-global-rebalances'
import { getUsersActivity } from '@/app/server-handlers/sdk/get-users-activity'
import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getSumrDelegatesWithDecayFactor } from '@/app/server-handlers/sumr-delegates-with-decay-factor'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { getSumrToClaim } from '@/app/server-handlers/sumr-to-claim'
import { PortfolioPageViewComponent } from '@/components/layout/PortfolioPageView/PortfolioPageViewComponent'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'

type PortfolioPageProps = {
  params: Promise<{
    walletAddress: string
  }>
}

const PortfolioPage = async ({ params }: PortfolioPageProps) => {
  const { walletAddress: walletAddressRaw } = await params

  const walletAddress = walletAddressRaw.toLowerCase()
  const cacheParams = [walletAddress]
  const cacheConfig = {
    revalidate: REVALIDATION_TIMES.PORTFOLIO_ASSETS,
    tags: [REVALIDATION_TAGS.PORTFOLIO_ASSETS, walletAddress],
  }

  const [
    walletData,
    { rebalances },
    sumrStakeDelegate,
    sumrEligibility,
    sumrBalances,
    sumrStakingInfo,
    { sumrDelegates, sumrDecayFactors },
    sumrToClaim,
    usersActivity,
    { vaultsDecorated, positionsList },
  ] = await Promise.all([
    unstableCache(portfolioWalletAssetsHandler, cacheParams, cacheConfig)(walletAddress),
    unstableCache(getGlobalRebalances, cacheParams, cacheConfig)(),
    unstableCache(getSumrDelegateStake, cacheParams, cacheConfig)({ walletAddress }),
    unstableCache(
      fetchRaysLeaderboard,
      cacheParams,
      cacheConfig,
    )({ userAddress: walletAddress, page: '1', limit: '1' }),
    unstableCache(getSumrBalances, cacheParams, cacheConfig)({ walletAddress }),
    unstableCache(getSumrStakingInfo, cacheParams, cacheConfig)(),
    unstableCache(getSumrDelegatesWithDecayFactor, cacheParams, cacheConfig)(),
    unstableCache(getSumrToClaim, cacheParams, cacheConfig)({ walletAddress }),
    unstableCache(getUsersActivity, cacheParams, cacheConfig)({ filterTestingWallets: false }),
    unstableCache(portfolioBulkRequest, cacheParams, cacheConfig)({ walletAddress }),
  ])

  const userVaultsIds = positionsList.map((position) => position.vaultData.id.toLowerCase())
  const userRebalances = rebalances.filter((rebalance) =>
    userVaultsIds.includes(rebalance.vault.id.toLowerCase()),
  )

  const rewardsData: ClaimDelegateExternalData = {
    sumrToClaim,
    sumrBalances,
    sumrStakeDelegate,
    sumrStakingInfo,
    sumrDelegates,
    sumrDecayFactors,
  }

  const totalRaysPoints = Number(sumrEligibility.leaderboard[0]?.totalPoints ?? 0)
  const tgeSnapshotPoints = Number(sumrEligibility.leaderboard[0]?.tgeSnapshotPoints ?? 0)

  const totalRays = totalRaysPoints - tgeSnapshotPoints

  const userActivity = usersActivity.usersActivity.filter(
    (activity) => activity.account.toLowerCase() === walletAddress.toLowerCase(),
  )

  return (
    <PortfolioPageViewComponent
      positions={positionsList}
      walletAddress={walletAddress}
      walletData={walletData}
      rewardsData={rewardsData}
      vaultsList={vaultsDecorated}
      rebalancesList={userRebalances}
      totalRays={totalRays}
      userActivity={userActivity}
    />
  )
}

export default PortfolioPage
