import {
  getPositionValues,
  getUniqueVaultId,
  sumrNetApyConfigCookieName,
} from '@summerfi/app-earn-ui'
import {
  type IArmadaPosition,
  type SDKVaultishType,
  type SingleSourceChartData,
  SupportedNetworkIds,
} from '@summerfi/app-types'
import {
  formatAddress,
  formatCryptoBalance,
  formatFiatBalance,
  getServerSideCookies,
  parseServerResponseToClient,
  safeParseJson,
  subgraphNetworkToId,
  supportedSDKNetwork,
  zero,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import { type Metadata } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getCachedUserBeachClubData } from '@/app/server-handlers/cached/beach-club'
import { getCachedBlogPosts } from '@/app/server-handlers/cached/blog-posts'
import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedPositionHistory } from '@/app/server-handlers/cached/get-position-history'
import { getCachedPositionsActivePeriods } from '@/app/server-handlers/cached/get-positions-active-periods'
import { getCachedSumrToClaim } from '@/app/server-handlers/cached/get-sumr-to-claim'
import { getDaoManagedVaultsIDsList } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultsApy } from '@/app/server-handlers/cached/get-vaults-apy'
import { getCachedVaultsInfo } from '@/app/server-handlers/cached/get-vaults-info'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { getCachedWalletAssets } from '@/app/server-handlers/cached/get-wallet-assets'
import { getCachedMigratablePositions } from '@/app/server-handlers/cached/migration'
import { getClaimableMerkleRewards } from '@/app/server-handlers/raw-calls/merkle'
import { getPortfolioSumrStakingV2Data } from '@/app/server-handlers/raw-calls/sumr-staking-v2'
import { getTallyDelegates } from '@/app/server-handlers/raw-calls/tally'
import { getUserPositions } from '@/app/server-handlers/sdk/get-user-positions'
import { getCachedFleetTokenSharePrice } from '@/app/server-handlers/share-price'
import { getSumrBalances } from '@/app/server-handlers/sumr-balances'
import { getSumrDelegateStake } from '@/app/server-handlers/sumr-delegate-stake'
import { getCachedSumrPrice } from '@/app/server-handlers/sumr-price'
import { getSumrStakingInfo } from '@/app/server-handlers/sumr-staking-info'
import { getSumrStakingRewards } from '@/app/server-handlers/sumr-staking-rewards'
import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { getPaginatedRebalanceActivity } from '@/app/server-handlers/tables-data/rebalance-activity/api'
import { getCachedTokenPrice } from '@/app/server-handlers/token-price'
import { PortfolioPageViewComponent } from '@/components/layout/PortfolioPageView/PortfolioPageViewComponent'
import { CACHE_TIMES } from '@/constants/revalidation'
import { type ClaimDelegateExternalData } from '@/features/claim-and-delegate/types'
import { getMigrationBestVaultApy } from '@/features/migration/helpers/get-migration-best-vault-apy'
import { mergePositionWithVault } from '@/features/portfolio/helpers/merge-position-with-vault'
import { type ClaimableRewards } from '@/features/portfolio/types'
import { type GetPositionHistoryQuery } from '@/graphql/clients/position-history/client'
import { getPositionHistoricalData } from '@/helpers/chart-helpers/get-position-historical-data'
import { getEstimatedSumrPrice } from '@/helpers/get-estimated-sumr-price'
import { getUserDataCacheHandler } from '@/helpers/get-user-data-cache-handler'
import { isValidAddress } from '@/helpers/is-valid-address'
import { getMerkleNowClaimableToken } from '@/helpers/merkle'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

type PortfolioPageProps = {
  params: Promise<{
    walletAddress: string
  }>
}

const portfolioCallsHandler = async ({
  walletAddress,
  sumrPriceUsd,
}: {
  walletAddress: string
  sumrPriceUsd: number
}) => {
  const userKey = walletAddress.toLowerCase()
  const cacheConfig = {
    revalidate: CACHE_TIMES.PORTFOLIO_DATA,
    tags: [getUserDataCacheHandler(userKey)],
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
    portfolioSumrStakingV2Data,
    claimableMerklRewards,
  ] = await Promise.all([
    getCachedWalletAssets(walletAddress),
    unstableCache(
      getSumrDelegateStake,
      ['sumrDelegateStake', userKey],
      cacheConfig,
    )({ walletAddress }),
    unstableCache(getSumrBalances, ['sumrBalances', userKey], cacheConfig)({ walletAddress }),
    unstableCache(getSumrStakingInfo, ['sumrStakingInfo'], cacheConfig)(),
    getCachedSumrToClaim(walletAddress),
    unstableCache(getUserPositions, ['userPositions', userKey], cacheConfig)({ walletAddress }),
    getCachedVaultsList(),
    getCachedConfig(),
    getCachedMigratablePositions({ walletAddress }),
    unstableCache(
      getPaginatedLatestActivity,
      ['latestActivity', userKey],
      cacheConfig,
    )({
      page: 1,
      limit: 50,
      usersAddresses: [],
    }),
    getCachedUserBeachClubData(walletAddress),
    getCachedPositionsActivePeriods({ walletAddress }),
    getCachedBlogPosts(),
    getCachedVaultsInfo(),
    unstableCache(
      getSumrStakingRewards,
      ['sumrStakingRewards', userKey],
      cacheConfig,
    )({ walletAddress, sumrPriceUsd }),
    unstableCache(
      getPortfolioSumrStakingV2Data,
      ['portfolioSumrStakingV2Data', userKey],
      cacheConfig,
    )({ walletAddress, sumrPriceUsd }),
    getClaimableMerkleRewards(walletAddress),
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
    portfolioSumrStakingV2Data,
    claimableMerklRewards,
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
  const [
    { walletAddress: walletAddressRaw },
    cookieRaw,
    sumrPrice,
    usdcPrice,
    LVUSDCSharePriceInUSDC,
    config,
  ] = await Promise.all([
    params,
    cookies(),
    getCachedSumrPrice(),
    getCachedTokenPrice('usd-coin'),
    getCachedFleetTokenSharePrice({
      // LVUSDC token, which is being rewarded in merkle as well
      fleetAddress: '0x98C49e13bf99D7CAd8069faa2A370933EC9EcF17', // Replace with actual fleet address
      chainId: SupportedNetworkIds.Base, // Replace with actual chain ID
    }),
    getCachedConfig(),
  ])

  const cookie = cookieRaw.toString()
  const sumrNetApyConfig = safeParseJson(getServerSideCookies(sumrNetApyConfigCookieName, cookie))
  const sumrPriceUsd = getEstimatedSumrPrice({
    config,
    sumrPrice,
    sumrNetApyConfig: sumrNetApyConfig ?? {},
  })

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
    portfolioSumrStakingV2Data,
    claimableMerklRewards,
  } = await portfolioCallsHandler({ walletAddress, sumrPriceUsd })

  const userPositionsJsonSafe = userPositions
    ? parseServerResponseToClient<IArmadaPosition[]>(userPositions)
    : []

  const migratablePositions = parseServerResponseToClient(migratablePositionsData)

  const daoManagedVaultsList = await getDaoManagedVaultsIDsList(vaultsList.vaults)

  const vaultsWithConfig = decorateVaultsWithConfig({
    vaults: vaultsList.vaults,
    systemConfig,
    userPositions: userPositionsJsonSafe,
    daoManagedVaultsList,
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
          getCachedPositionHistory({
            network: supportedSDKNetwork(vault.protocol.network),
            address: walletAddress.toLowerCase(),
            vault,
          }),
        ),
      ).then(mapPortfolioVaultsApy),
      getCachedVaultsApy({
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
    authorizedStakingRewardsCallerBase: false, // not used on this screen
  }

  const positionsHistoricalChartMap = positionsWithVault.reduce<{
    [key: string]: SingleSourceChartData
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

  const claimableMerklRewardsData = claimableMerklRewards.perChain[SupportedNetworkIds.Base]

  const usdcClaimableNow = getMerkleNowClaimableToken(claimableMerklRewardsData, 'USDC')
  const lvUsdcClaimableNow = getMerkleNowClaimableToken(claimableMerklRewardsData, 'LVUSDC')

  const rewardsList = [
    {
      symbol: 'USDC',
      amount: usdcClaimableNow,
      amountUSD: usdcClaimableNow * usdcPrice.usd,
      priceUsd: usdcPrice.usd,
    },
    {
      symbol: 'LVUSDC',
      amount: lvUsdcClaimableNow,
      amountUSD: lvUsdcClaimableNow * LVUSDCSharePriceInUSDC * usdcPrice.usd,
      priceUsd: LVUSDCSharePriceInUSDC * usdcPrice.usd,
    },
  ]

  const claimableRewards: ClaimableRewards = {
    rewards: rewardsList,
    usdAmount: rewardsList.reduce((acc, reward) => acc + reward.amountUSD, 0),
  }

  return (
    <PortfolioPageViewComponent
      positions={positionsWithVault}
      viewWalletAddress={walletAddress}
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
      claimableRewards={claimableRewards}
      blogPosts={blogPosts}
      portfolioSumrStakingV2Data={portfolioSumrStakingV2Data}
      sumrPriceUsd={sumrPriceUsd}
    />
  )
}

export async function generateMetadata({
  params,
  searchParams,
}: PortfolioPageProps & {
  searchParams: { [key: string]: string | string[] | undefined }
}): Promise<Metadata> {
  const [
    { walletAddress: walletAddressRaw },
    headersList,
    searchParamsAwaited,
    cookieRaw,
    sumrPrice,
    config,
  ] = await Promise.all([
    params,
    headers(),
    searchParams,
    cookies(),
    getCachedSumrPrice(),
    getCachedConfig(),
  ])
  const prodHost = headersList.get('host')
  const baseUrl = new URL(`https://${prodHost}`)

  const walletAddress = walletAddressRaw.toLowerCase()
  const cookie = cookieRaw.toString()
  const sumrNetApyConfig = safeParseJson(getServerSideCookies(sumrNetApyConfigCookieName, cookie))
  const sumrPriceUsd = getEstimatedSumrPrice({
    config,
    sumrPrice,
    sumrNetApyConfig: sumrNetApyConfig ?? {},
  })

  const { userPositions, vaultsList, systemConfig, vaultsInfo } = await portfolioCallsHandler({
    walletAddress,
    sumrPriceUsd,
  })

  const vaultsInfoParsed = parseServerResponseToClient(vaultsInfo)

  const userPositionsJsonSafe = userPositions
    ? parseServerResponseToClient<IArmadaPosition[]>(userPositions)
    : []

  const daoManagedVaultsList = await getDaoManagedVaultsIDsList(vaultsList.vaults)

  const vaultsWithConfig = decorateVaultsWithConfig({
    vaults: vaultsList.vaults,
    systemConfig,
    userPositions: userPositionsJsonSafe,
    daoManagedVaultsList,
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
