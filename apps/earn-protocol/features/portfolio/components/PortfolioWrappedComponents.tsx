import { fetchRaysLeaderboard } from '@/app/server-handlers/leaderboard'
import { portfolioBulkRequest } from '@/app/server-handlers/portfolio-bulk-request/portfolio-bulk-request'
import { getGlobalRebalances } from '@/app/server-handlers/sdk/get-global-rebalances'
import { getUsersActivity } from '@/app/server-handlers/sdk/get-users-activity'
import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getSumrDelegatesWithDecayFactor } from '@/app/server-handlers/sumr-delegates-with-decay-factor'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { getSumrToClaim } from '@/app/server-handlers/sumr-to-claim'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { PortfolioOverview } from '@/features/portfolio/components/PortfolioOverview/PortfolioOverview'
import { PortfolioRebalanceActivity } from '@/features/portfolio/components/PortfolioRebalanceActivity/PortfolioRebalanceActivity'
import { PortfolioRewards } from '@/features/portfolio/components/PortfolioRewards/PortfolioRewards'
import { PortfolioWallet } from '@/features/portfolio/components/PortfolioWallet/PortfolioWallet'
import { PortfolioYourActivity } from '@/features/portfolio/components/PortfolioYourActivity/PotfolioYourActivity'

export const PortfolioOverviewWrapped = async ({ walletAddress }: { walletAddress: string }) => {
  const [
    sumrStakeDelegate,
    sumrBalances,
    sumrStakingInfo,
    { sumrDelegates, sumrDecayFactors },
    sumrToClaim,
    { vaultsDecorated, positionsList },
  ] = await Promise.all([
    getSumrDelegateStake({ walletAddress }),
    getSumrBalances({ walletAddress }),
    getSumrStakingInfo(),
    getSumrDelegatesWithDecayFactor(),
    getSumrToClaim({ walletAddress }),
    portfolioBulkRequest({ walletAddress }),
  ])

  const rewardsData: ClaimDelegateExternalData = {
    sumrToClaim,
    sumrBalances,
    sumrStakeDelegate,
    sumrStakingInfo,
    sumrDelegates,
    sumrDecayFactors,
  }

  return (
    <PortfolioOverview
      positions={positionsList}
      vaultsList={vaultsDecorated}
      rewardsData={rewardsData}
    />
  )
}

export const PortfolioWalletWrapped = ({
  walletAddress,
  walletData,
  vaultsDecorated,
}: {
  walletAddress: string
}) => {
  return <PortfolioWallet walletData={walletData} vaultsList={vaultsDecorated} />
}

export const PortfolioRebalanceActivityWrapped = async ({
  walletAddress,
}: {
  walletAddress: string
}) => {
  const [{ rebalances }, { vaultsDecorated, positionsList }] = await Promise.all([
    getGlobalRebalances(),
    portfolioBulkRequest({ walletAddress }),
  ])
  const userVaultsIds = positionsList.map((position) => position.vaultData.id.toLowerCase())

  const userRebalances = rebalances.filter((rebalance) =>
    userVaultsIds.includes(rebalance.vault.id.toLowerCase()),
  )

  return (
    <PortfolioRebalanceActivity
      positions={positionsList}
      rebalancesList={userRebalances}
      walletAddress={walletAddress}
      vaultsList={vaultsDecorated}
    />
  )
}

export const PortfolioYourActivityWrapped = async ({
  walletAddress,
}: {
  walletAddress: string
}) => {
  const [usersActivity] = await Promise.all([getUsersActivity({ filterTestingWallets: false })])

  const userActivity = usersActivity.usersActivity.filter(
    (activity) => activity.account.toLowerCase() === walletAddress.toLowerCase(),
  )

  return <PortfolioYourActivity userActivity={userActivity} />
}

export const PortfolioRewardsWrapped = async ({ walletAddress }: { walletAddress: string }) => {
  const [
    sumrStakeDelegate,
    sumrEligibility,
    sumrBalances,
    sumrStakingInfo,
    { sumrDelegates, sumrDecayFactors },
    sumrToClaim,
  ] = await Promise.all([
    getSumrDelegateStake({ walletAddress }),
    fetchRaysLeaderboard({ userAddress: walletAddress, page: '1', limit: '1' }),
    getSumrBalances({ walletAddress }),
    getSumrStakingInfo(),
    getSumrDelegatesWithDecayFactor(),
    getSumrToClaim({ walletAddress }),
  ])

  const totalRaysPoints = Number(sumrEligibility.leaderboard[0]?.totalPoints ?? 0)
  const tgeSnapshotPoints = Number(sumrEligibility.leaderboard[0]?.tgeSnapshotPoints ?? 0)

  const totalRays = totalRaysPoints - tgeSnapshotPoints

  const rewardsData: ClaimDelegateExternalData = {
    sumrToClaim,
    sumrBalances,
    sumrStakeDelegate,
    sumrStakingInfo,
    sumrDelegates,
    sumrDecayFactors,
  }

  return (
    <PortfolioRewards
      rewardsData={rewardsData}
      totalRays={totalRays}
      walletAddress={walletAddress}
    />
  )
}
