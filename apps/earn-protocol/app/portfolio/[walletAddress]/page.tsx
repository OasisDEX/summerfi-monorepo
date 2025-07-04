import {
  getPositionValues,
  getUniqueVaultId,
  REVALIDATION_TAGS,
  REVALIDATION_TIMES,
} from '@summerfi/app-earn-ui'
import {
  type HistoryChartData,
  type IArmadaPosition,
  type SDKVaultishType,
} from '@summerfi/app-types'
import {
  formatAddress,
  formatCryptoBalance,
  formatFiatBalance,
  parseServerResponseToClient,
  subgraphNetworkToId,
  zero,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import { type Metadata } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getUserBeachClubData } from '@/app/server-handlers/beach-club/get-user-beach-club-data'
import { fetchRaysLeaderboard } from '@/app/server-handlers/leaderboard'
import { getMigratablePositions } from '@/app/server-handlers/migration'
import { portfolioWalletAssetsHandler } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { getPositionHistory } from '@/app/server-handlers/position-history'
import { getUserPositions } from '@/app/server-handlers/sdk/get-user-positions'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { getSumrToClaim } from '@/app/server-handlers/sumr-to-claim'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { getPaginatedRebalanceActivity } from '@/app/server-handlers/tables-data/rebalance-activity/api'
import { getTallyDelegates } from '@/app/server-handlers/tally'
import { getVaultsApy } from '@/app/server-handlers/vaults-apy'
import { PortfolioPageViewComponent } from '@/components/layout/PortfolioPageView/PortfolioPageViewComponent'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { getMigrationBestVaultApy } from '@/features/migration/helpers/get-migration-best-vault-apy'
import { mergePositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'
import { type GetPositionHistoryQuery } from '@/graphql/clients/position-history/client'
import { getPositionHistoricalData } from '@/helpers/chart-helpers/get-position-historical-data'
import { isValidAddress } from '@/helpers/is-valid-address'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

type PortfolioPageProps = {
  params: Promise<{
    walletAddress: string
  }>
}

const portfolioCallsHandler = async (walletAddress: string) => {
  const cacheConfig = {
    revalidate: REVALIDATION_TIMES.PORTFOLIO_DATA,
    tags: [REVALIDATION_TAGS.PORTFOLIO_DATA, walletAddress.toLowerCase()],
  }
  const [
    walletData,
    sumrStakeDelegate,
    sumrEligibility,
    sumrBalances,
    sumrStakingInfo,
    sumrToClaim,
    userPositions,
    vaultsList,
    systemConfig,
    migratablePositionsData,
    latestActivity,
    beachClubData,
  ] = await Promise.all([
    portfolioWalletAssetsHandler(walletAddress),
    unstableCache(getSumrDelegateStake, [walletAddress], cacheConfig)({ walletAddress }),
    fetchRaysLeaderboard({ userAddress: walletAddress, page: '1', limit: '1' }),
    unstableCache(getSumrBalances, [walletAddress], cacheConfig)({ walletAddress }),
    unstableCache(getSumrStakingInfo, [walletAddress], cacheConfig)(),
    unstableCache(getSumrToClaim, [walletAddress], cacheConfig)({ walletAddress }),
    unstableCache(getUserPositions, [walletAddress], cacheConfig)({ walletAddress }),
    getVaultsList(),
    systemConfigHandler(),
    unstableCache(getMigratablePositions, [walletAddress], cacheConfig)({ walletAddress }),
    unstableCache(
      getPaginatedLatestActivity,
      [walletAddress],
      cacheConfig,
    )({
      page: 1,
      limit: 50,
      usersAddresses: [walletAddress],
    }),
    unstableCache(getUserBeachClubData, [walletAddress], cacheConfig)(walletAddress),
  ])

  return {
    walletData,
    sumrStakeDelegate,
    sumrEligibility,
    sumrBalances,
    sumrStakingInfo,
    sumrToClaim,
    userPositions,
    vaultsList,
    systemConfig,
    migratablePositionsData,
    latestActivity,
    beachClubData,
  }
}

const mapPortfolioVaultsApy = (
  responses: { positionHistory: GetPositionHistoryQuery; vault: SDKVaultishType }[],
) =>
  responses.reduce<{
    [key: string]: GetPositionHistoryQuery
  }>((acc, { positionHistory, vault }) => {
    return {
      ...acc,
      [getUniqueVaultId(vault)]: parseServerResponseToClient(positionHistory),
    }
  }, {})

const PortfolioPage = async ({ params }: PortfolioPageProps) => {
  const { walletAddress: walletAddressRaw } = await params

  const walletAddress = walletAddressRaw.toLowerCase()

  if (!isValidAddress(walletAddress)) {
    redirect('/not-found')
  }

  const {
    walletData,
    sumrStakeDelegate,
    sumrEligibility,
    sumrBalances,
    sumrStakingInfo,
    sumrToClaim,
    userPositions,
    vaultsList,
    systemConfig,
    migratablePositionsData,
    latestActivity,
    beachClubData,
  } = await portfolioCallsHandler(walletAddress)

  const userPositionsJsonSafe = userPositions
    ? parseServerResponseToClient<IArmadaPosition[]>(userPositions)
    : []

  const migratablePositions = parseServerResponseToClient(migratablePositionsData)

  const vaultsWithConfig = decorateVaultsWithConfig({
    vaults: vaultsList.vaults,
    systemConfig: systemConfig.config,
    userPositions: userPositionsJsonSafe,
  })

  const positionsWithVault = userPositionsJsonSafe.map((position) => {
    return mergePositionWithVault({
      position,
      vaultsWithConfig,
    })
  })

  const userVaultsIds = positionsWithVault.map((position) => getUniqueVaultId(position.vault))

  const [positionHistoryMap, vaultsApyByNetworkMap, rebalanceActivity, tallyDelegates] =
    await Promise.all([
      Promise.all(
        vaultsWithConfig.map((vault) =>
          getPositionHistory({
            network: vault.protocol.network,
            address: walletAddress.toLowerCase(),
            vault,
          }),
        ),
      ).then(mapPortfolioVaultsApy),
      getVaultsApy({
        fleets: vaultsWithConfig.map(({ id, protocol: { network } }) => ({
          fleetAddress: id,
          chainId: subgraphNetworkToId(network),
        })),
      }),
      getPaginatedRebalanceActivity({
        page: 1,
        limit: 50,
        strategies: userVaultsIds,
      }),
      getTallyDelegates(sumrStakeDelegate.delegatedTo),
    ])

  const rewardsData: ClaimDelegateExternalData = {
    sumrToClaim,
    sumrBalances,
    sumrStakeDelegate,
    sumrStakingInfo,
    tallyDelegates,
  }

  const totalRaysPoints = Number(sumrEligibility.leaderboard[0]?.totalPoints ?? 0)
  const tgeSnapshotPoints = Number(sumrEligibility.leaderboard[0]?.tgeSnapshotPoints ?? 0)

  const totalRays = totalRaysPoints - tgeSnapshotPoints

  const positionsHistoricalChartMap = positionsWithVault.reduce<{
    [key: string]: HistoryChartData
  }>(
    (acc, position) => ({
      ...acc,
      [getUniqueVaultId(position.vault)]: getPositionHistoricalData({
        position: position.position,
        vault: position.vault,
        positionHistory: positionHistoryMap[getUniqueVaultId(position.vault)],
      }),
    }),
    {},
  )

  const migrationBestVaultApy = getMigrationBestVaultApy({
    migratablePositions,
    vaultsWithConfig,
    vaultsApyByNetworkMap,
  })

  return (
    <PortfolioPageViewComponent
      positions={positionsWithVault}
      walletAddress={walletAddress}
      walletData={walletData}
      rewardsData={rewardsData}
      vaultsList={vaultsWithConfig}
      totalRays={totalRays}
      latestActivity={latestActivity}
      positionsHistoricalChartMap={positionsHistoricalChartMap}
      vaultsApyByNetworkMap={vaultsApyByNetworkMap}
      migratablePositions={migratablePositions}
      migrationBestVaultApy={migrationBestVaultApy}
      rebalanceActivity={rebalanceActivity}
      beachClubData={beachClubData}
    />
  )
}

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const [{ walletAddress: walletAddressRaw }, headersList] = await Promise.all([params, headers()])
  const prodHost = headersList.get('host')
  const baseUrl = new URL(`https://${prodHost}`)

  const walletAddress = walletAddressRaw.toLowerCase()

  const { userPositions, vaultsList, systemConfig } = await portfolioCallsHandler(walletAddress)

  const userPositionsJsonSafe = userPositions
    ? parseServerResponseToClient<IArmadaPosition[]>(userPositions)
    : []

  const vaultsWithConfig = decorateVaultsWithConfig({
    vaults: vaultsList.vaults,
    systemConfig: systemConfig.config,
    userPositions: userPositionsJsonSafe,
  })

  const positionsWithVault = userPositionsJsonSafe.map((position) => {
    return mergePositionWithVault({
      position,
      vaultsWithConfig,
    })
  })

  const totalSummerPortfolioUSD = positionsWithVault.reduce(
    (acc, position) => acc + getPositionValues(position).netValueUSD.toNumber(),

    0,
  )

  const totalSUMREarned = positionsWithVault.reduce((acc, { position }) => {
    const sumrReward = position.rewards.find((reward) => {
      return reward.claimed.token.symbol === 'SUMR'
    })

    if (!sumrReward) {
      return zero
    }

    return acc.plus(
      new BigNumber(sumrReward.claimable.amount).plus(new BigNumber(sumrReward.claimed.amount)),
    )
  }, zero)

  return {
    title: `Lazy Summer Protocol - ${formatAddress(walletAddress, { first: 6 })} - $${formatFiatBalance(totalSummerPortfolioUSD)} in Lazy Summer`,
    description:
      "Get effortless access to crypto's best DeFi yields. Continually rebalanced by AI powered Keepers to earn you more while saving you time and reducing costs.",
    openGraph: {
      siteName: 'Lazy Summer Protocol',
      images: `${baseUrl}earn/api/og/portfolio?amount=$${formatFiatBalance(totalSummerPortfolioUSD)}&address=${walletAddress}&sumrEarned=${formatCryptoBalance(totalSUMREarned)}`,
    },
  }
}

export default PortfolioPage
