import { getUniqueVaultId, REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import {
  type HistoryChartData,
  type IArmadaPosition,
  type SDKVaultishType,
} from '@summerfi/app-types'
import { parseServerResponseToClient, subgraphNetworkToId } from '@summerfi/app-utils'
import { unstable_cache as unstableCache } from 'next/cache'
import { redirect } from 'next/navigation'

import { fetchRaysLeaderboard } from '@/app/server-handlers/leaderboard'
import { getMigratablePositions } from '@/app/server-handlers/migration'
import { portfolioWalletAssetsHandler } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { getPositionHistory } from '@/app/server-handlers/position-history'
import { getGlobalRebalances } from '@/app/server-handlers/sdk/get-global-rebalances'
import { getUserPositions } from '@/app/server-handlers/sdk/get-user-positions'
import { getUsersActivity } from '@/app/server-handlers/sdk/get-users-activity'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getSumrDelegatesWithDecayFactor } from '@/app/server-handlers/sumr-delegates-with-decay-factor'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { getSumrToClaim } from '@/app/server-handlers/sumr-to-claim'
import systemConfigHandler from '@/app/server-handlers/system-config'
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
    { rebalances },
    sumrStakeDelegate,
    sumrEligibility,
    sumrBalances,
    sumrStakingInfo,
    { sumrDelegates, sumrDecayFactors },
    sumrToClaim,
    usersActivity,
    userPositions,
    vaultsList,
    systemConfig,
    migratablePositions,
  ] = await Promise.all([
    portfolioWalletAssetsHandler(walletAddress),
    unstableCache(getGlobalRebalances, [walletAddress], cacheConfig)(),
    unstableCache(getSumrDelegateStake, [walletAddress], cacheConfig)({ walletAddress }),
    fetchRaysLeaderboard({ userAddress: walletAddress, page: '1', limit: '1' }),
    unstableCache(getSumrBalances, [walletAddress], cacheConfig)({ walletAddress }),
    unstableCache(getSumrStakingInfo, [walletAddress], cacheConfig)(),
    unstableCache(getSumrDelegatesWithDecayFactor, [walletAddress], cacheConfig)(),
    unstableCache(getSumrToClaim, [walletAddress], cacheConfig)({ walletAddress }),
    unstableCache(
      getUsersActivity,
      [walletAddress],
      cacheConfig,
    )({ filterTestingWallets: false, walletAddress }),
    unstableCache(getUserPositions, [walletAddress], cacheConfig)({ walletAddress }),
    getVaultsList(),
    systemConfigHandler(),
    unstableCache(getMigratablePositions, [walletAddress], cacheConfig)({ walletAddress }),
  ])

  return {
    walletData,
    rebalances,
    sumrStakeDelegate,
    sumrEligibility,
    sumrBalances,
    sumrStakingInfo,
    sumrDelegates,
    sumrDecayFactors,
    sumrToClaim,
    usersActivity,
    userPositions,
    vaultsList,
    systemConfig,
    migratablePositions,
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
    rebalances,
    sumrStakeDelegate,
    sumrEligibility,
    sumrBalances,
    sumrStakingInfo,
    sumrDelegates,
    sumrDecayFactors,
    sumrToClaim,
    usersActivity,
    userPositions,
    vaultsList,
    systemConfig,
    migratablePositions,
  } = await portfolioCallsHandler(walletAddress)

  const vaultsWithConfig = decorateVaultsWithConfig({
    vaults: vaultsList.vaults,
    systemConfig: systemConfig.config,
  })

  const userPositionsJsonSafe = userPositions
    ? parseServerResponseToClient<IArmadaPosition[]>(userPositions)
    : []

  const _migratablePositions = parseServerResponseToClient(migratablePositions)

  const positionsWithVault = userPositionsJsonSafe.map((position) => {
    return mergePositionWithVault({
      position,
      vaultsWithConfig,
    })
  })

  const [positionHistoryMap, vaultsApyByNetworkMap] = await Promise.all([
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
  ])

  const userVaultsIds = positionsWithVault.map((position) => position.vault.id.toLowerCase())
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
    migratablePositions: _migratablePositions,
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
      rebalancesList={userRebalances}
      totalRays={totalRays}
      userActivity={userActivity}
      positionsHistoricalChartMap={positionsHistoricalChartMap}
      vaultsApyByNetworkMap={vaultsApyByNetworkMap}
      migratablePositions={migratablePositions}
      migrationBestVaultApy={migrationBestVaultApy}
    />
  )
}

export default PortfolioPage
