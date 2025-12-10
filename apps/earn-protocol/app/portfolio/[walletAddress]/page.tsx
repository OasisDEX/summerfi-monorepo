import {
  getPositionValues,
  getUniqueVaultId,
  REVALIDATION_TAGS,
  REVALIDATION_TIMES,
} from '@summerfi/app-earn-ui'
import { configEarnAppFetcher, getVaultsApy, getVaultsInfo } from '@summerfi/app-server-handlers'
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
  supportedSDKNetwork,
  zero,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import { type Metadata } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getUserBeachClubData } from '@/app/server-handlers/beach-club/get-user-beach-club-data'
import { getBlogPosts } from '@/app/server-handlers/blog-posts'
import { getMigratablePositions } from '@/app/server-handlers/migration'
import { portfolioWalletAssetsHandler } from '@/app/server-handlers/portfolio/portfolio-wallet-assets-handler'
import { getPositionHistory } from '@/app/server-handlers/position-history'
import { getPositionsActivePeriods } from '@/app/server-handlers/positions-active-periods'
import { getUserPositions } from '@/app/server-handlers/sdk/get-user-positions'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { getSumrStakingRewards } from '@/app/server-handlers/sumr-staking-rewards'
import { getSumrToClaim } from '@/app/server-handlers/sumr-to-claim'
import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { getPaginatedRebalanceActivity } from '@/app/server-handlers/tables-data/rebalance-activity/api'
import { getTallyDelegates } from '@/app/server-handlers/tally'
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
    sumrBalances,
    sumrStakingInfo,
    sumrToClaim,
    userPositions,
    vaultsList,
    systemConfig,
    migratablePositionsData,
    latestActivity,
    beachClubData,
    positionsActivePeriods,
    blogPosts,
    vaultsInfo,
    sumrStakingRewards,
  ] = await Promise.all([
    portfolioWalletAssetsHandler(walletAddress),
    unstableCache(getSumrDelegateStake, [walletAddress], cacheConfig)({ walletAddress }),
    unstableCache(getSumrBalances, [walletAddress], cacheConfig)({ walletAddress }),
    unstableCache(getSumrStakingInfo, [walletAddress], cacheConfig)(),
    unstableCache(getSumrToClaim, [walletAddress], cacheConfig)({ walletAddress }),
    unstableCache(getUserPositions, [walletAddress], cacheConfig)({ walletAddress }),
    getVaultsList(),
    unstableCache(configEarnAppFetcher, [REVALIDATION_TAGS.CONFIG], {
      revalidate: REVALIDATION_TIMES.CONFIG,
      tags: [REVALIDATION_TAGS.CONFIG],
    })(),
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
    unstableCache(getPositionsActivePeriods, [walletAddress], cacheConfig)(walletAddress),
    unstableCache(getBlogPosts, [], cacheConfig)(),
    unstableCache(getVaultsInfo, [REVALIDATION_TAGS.VAULTS_LIST], {
      revalidate: REVALIDATION_TIMES.VAULTS_LIST,
      tags: [REVALIDATION_TAGS.VAULTS_LIST],
    })(),
    unstableCache(getSumrStakingRewards, [walletAddress], cacheConfig)({ walletAddress }),
  ])

  return {
    walletData,
    sumrStakeDelegate,
    sumrBalances,
    sumrStakingInfo,
    sumrToClaim,
    userPositions,
    vaultsList,
    systemConfig,
    migratablePositionsData,
    latestActivity,
    beachClubData,
    positionsActivePeriods,
    blogPosts,
    vaultsInfo,
    sumrStakingRewards,
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
    sumrBalances,
    sumrStakingInfo,
    sumrToClaim,
    userPositions,
    vaultsList,
    systemConfig,
    migratablePositionsData,
    latestActivity,
    beachClubData,
    positionsActivePeriods,
    blogPosts,
    vaultsInfo,
    sumrStakingRewards,
  } = await portfolioCallsHandler(walletAddress)

  const userPositionsJsonSafe = userPositions
    ? parseServerResponseToClient<IArmadaPosition[]>(userPositions)
    : []

  const migratablePositions = parseServerResponseToClient(migratablePositionsData)

  const vaultsWithConfig = decorateVaultsWithConfig({
    vaults: vaultsList.vaults,
    systemConfig,
    userPositions: userPositionsJsonSafe,
  })

  const vaultsInfoParsed = parseServerResponseToClient(vaultsInfo)

  const positionsWithVault = userPositionsJsonSafe.map((position) => {
    return mergePositionWithVault({
      position,
      vaultsWithConfig,
      vaultsInfo: vaultsInfoParsed,
    })
  })

  const userVaultsIds = positionsWithVault.map((position) => getUniqueVaultId(position.vault))

  const [positionHistoryMap, vaultsApyByNetworkMap, rebalanceActivity, tallyDelegates] =
    await Promise.all([
      Promise.all(
        vaultsWithConfig.map((vault) =>
          getPositionHistory({
            network: supportedSDKNetwork(vault.protocol.network),
            address: walletAddress.toLowerCase(),
            vault,
          }),
        ),
      ).then(mapPortfolioVaultsApy),
      unstableCache(getVaultsApy, [walletAddress], {
        revalidate: REVALIDATION_TIMES.INTEREST_RATES,
        tags: [REVALIDATION_TAGS.INTEREST_RATES],
      })({
        fleets: vaultsWithConfig.map(({ id, protocol: { network } }) => ({
          fleetAddress: id,
          chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
        })),
      }),
      getPaginatedRebalanceActivity({
        page: 1,
        limit: 50,
        strategies: userVaultsIds,
        periods: positionsActivePeriods,
      }),
      getTallyDelegates(sumrStakeDelegate.delegatedToV2),
    ])

  const rewardsData: ClaimDelegateExternalData = {
    sumrToClaim,
    sumrBalances,
    sumrStakeDelegate,
    sumrStakingInfo,
    tallyDelegates,
    sumrRewardApy: sumrStakingRewards.sumrRewardApy,
    sumrRewardAmount: sumrStakingRewards.sumrRewardAmount,
  }

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
      latestActivity={latestActivity}
      positionsHistoricalChartMap={positionsHistoricalChartMap}
      vaultsApyByNetworkMap={vaultsApyByNetworkMap}
      migratablePositions={migratablePositions}
      migrationBestVaultApy={migrationBestVaultApy}
      rebalanceActivity={rebalanceActivity}
      beachClubData={beachClubData}
      blogPosts={blogPosts}
    />
  )
}

export async function generateMetadata({
  params,
  searchParams,
}: PortfolioPageProps & {
  searchParams: { [key: string]: string | string[] | undefined }
}): Promise<Metadata> {
  const [{ walletAddress: walletAddressRaw }, headersList, searchParamsAwaited] = await Promise.all(
    [params, headers(), searchParams],
  )
  const prodHost = headersList.get('host')
  const baseUrl = new URL(`https://${prodHost}`)

  const walletAddress = walletAddressRaw.toLowerCase()

  const { userPositions, vaultsList, systemConfig, vaultsInfo } =
    await portfolioCallsHandler(walletAddress)

  const vaultsInfoParsed = parseServerResponseToClient(vaultsInfo)

  const userPositionsJsonSafe = userPositions
    ? parseServerResponseToClient<IArmadaPosition[]>(userPositions)
    : []

  const vaultsWithConfig = decorateVaultsWithConfig({
    vaults: vaultsList.vaults,
    systemConfig,
    userPositions: userPositionsJsonSafe,
  })

  const positionsWithVault = userPositionsJsonSafe.map((position) => {
    return mergePositionWithVault({
      position,
      vaultsWithConfig,
      vaultsInfo: vaultsInfoParsed,
    })
  })

  const totalSummerPortfolioUSD = positionsWithVault.reduce(
    (acc, position) => acc + getPositionValues(position).netValueUSD.toNumber(),

    0,
  )

  const totalSUMREarned = positionsWithVault.reduce((acc, { position }) => {
    return acc.plus(
      new BigNumber(position.claimableSummerToken.amount).plus(
        new BigNumber(position.claimedSummerToken.amount),
      ),
    )
  }, zero)

  let ogImageUrl = ''

  if (typeof searchParamsAwaited.game !== 'undefined') {
    ogImageUrl = `${baseUrl}earn/img/misc/yield_racer.png`
  } else {
    ogImageUrl = `${baseUrl}earn/api/og/portfolio?amount=$${formatFiatBalance(totalSummerPortfolioUSD)}&address=${walletAddress}&sumrEarned=${formatCryptoBalance(totalSUMREarned)}`
  }

  return {
    title: `Lazy Summer Protocol - ${formatAddress(walletAddress, { first: 6 })} - $${formatFiatBalance(totalSummerPortfolioUSD)} in Lazy Summer`,
    description:
      "Get effortless access to crypto's best DeFi yields. Continually rebalanced by AI powered Keepers to earn you more while saving you time and reducing costs.",
    openGraph: {
      siteName: 'Lazy Summer Protocol',
      images: ogImageUrl,
    },
  }
}

export default PortfolioPage
