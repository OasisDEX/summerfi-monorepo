import {
  fetchForecastData,
  getDisplayToken,
  getPositionValues,
  parseForecastDatapoints,
  sumrNetApyConfigCookieName,
  Text,
} from '@summerfi/app-earn-ui'
import {
  getArksInterestRates,
  getVaultInfo,
  getVaultsHistoricalApy,
} from '@summerfi/app-server-handlers'
import {
  type IArmadaPosition,
  type PositionForecastAPIResponse,
  type SupportedSDKNetworks,
} from '@summerfi/app-types'
import {
  formatCryptoBalance,
  getServerSideCookies,
  humanNetworktoSDKNetwork,
  parseServerResponseToClient,
  safeParseJson,
  subgraphNetworkToId,
  supportedSDKNetwork,
  zero,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { capitalize } from 'lodash-es'
import { type Metadata } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAddress } from 'viem'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedPositionHistory } from '@/app/server-handlers/cached/get-position-history'
import { getCachedPositionsActivePeriods } from '@/app/server-handlers/cached/get-positions-active-periods'
import { getCachedIsVaultDaoManaged } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultDetails } from '@/app/server-handlers/cached/get-vault-details'
import { getCachedVaultsApy } from '@/app/server-handlers/cached/get-vaults-apy'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { getCachedMigratablePositions } from '@/app/server-handlers/cached/migration'
import { getUserPosition } from '@/app/server-handlers/sdk/get-user-position'
import { getCachedSumrPrice } from '@/app/server-handlers/sumr-price'
import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { getPaginatedRebalanceActivity } from '@/app/server-handlers/tables-data/rebalance-activity/api'
import { getPaginatedTopDepositors } from '@/app/server-handlers/tables-data/top-depositors/api'
import { VaultManageView } from '@/components/layout/VaultManageView/VaultManageView'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'
import { getMigrationBestVaultApy } from '@/features/migration/helpers/get-migration-best-vault-apy'
import { getArkHistoricalChartData } from '@/helpers/chart-helpers/get-ark-historical-data'
import { getPositionPerformanceData } from '@/helpers/chart-helpers/get-position-performance-data'
import { getEstimatedSumrPrice } from '@/helpers/get-estimated-sumr-price'
import { getSeoKeywords } from '@/helpers/seo-keywords'
import {
  decorateVaultsWithConfig,
  getVaultIdByVaultCustomName,
} from '@/helpers/vault-custom-value-helpers'

type EarnVaultManagePageProps = {
  params: Promise<{
    vaultId: string
    network: SupportedSDKNetworks
    walletAddress: string
  }>
}

const EarnVaultManagePage = async ({ params }: EarnVaultManagePageProps) => {
  const [{ network: paramsNetwork, vaultId, walletAddress }, configRaw, sumrPrice] =
    await Promise.all([params, getCachedConfig(), getCachedSumrPrice()])
  const parsedNetwork = humanNetworktoSDKNetwork(paramsNetwork)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  const systemConfig = parseServerResponseToClient(configRaw)

  const parsedVaultId = isAddress(vaultId)
    ? vaultId.toLowerCase()
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

  if (!parsedVaultId) {
    redirect('/not-found')
  }

  if (!isAddress(walletAddress)) {
    redirect('/not-found')
  }

  const strategy = `${parsedVaultId}-${parsedNetwork}`

  const [vault, { vaults }, position, topDepositors, latestActivity, rebalanceActivity] =
    await Promise.all([
      getCachedVaultDetails({
        vaultAddress: parsedVaultId,
        network: parsedNetwork,
      }),
      getCachedVaultsList(),
      getUserPosition({
        vaultAddress: parsedVaultId,
        network: parsedNetwork,
        walletAddress,
      }),
      getPaginatedTopDepositors({
        page: 1,
        limit: 4,
        strategies: [strategy],
      }),
      getPaginatedLatestActivity({
        page: 1,
        limit: 4,
        strategies: [strategy],
        usersAddresses: [walletAddress],
      }),
      getCachedPositionsActivePeriods({ walletAddress }).then((periods) => {
        return getPaginatedRebalanceActivity({
          page: 1,
          limit: 4,
          strategies: [strategy],
          startTimestamp: dayjs().subtract(30, 'days').unix(),
          periods,
        })
      }),
    ])

  if (!vault) {
    return (
      <Text>
        No vault found with the id {vaultId} on the network {parsedNetwork}
      </Text>
    )
  }

  if (!position) {
    return (
      <Text>
        No position found on {walletAddress} on the network {parsedNetwork}
      </Text>
    )
  }

  const daoManagedVaultsList = (
    await Promise.all(
      vaults.map(async (v) => {
        const isDaoManaged = await getCachedIsVaultDaoManaged({
          fleetAddress: v.id,
          network: supportedSDKNetwork(v.protocol.network),
        })

        return isDaoManaged ? v.id : false
      }),
    )
  ).filter(Boolean) as `0x${string}`[]

  const [vaultWithConfig] = decorateVaultsWithConfig({
    vaults: [vault],
    systemConfig,
    userPositions: [position],
    daoManagedVaultsList,
  })

  const allVaultsWithConfig = decorateVaultsWithConfig({
    vaults,
    systemConfig,
    daoManagedVaultsList,
  })

  const { netValue } = getPositionValues({
    position,
    vault,
  })

  const cacheConfig = {
    revalidate: CACHE_TIMES.INTEREST_RATES,
    tags: [CACHE_TAGS.INTEREST_RATES],
  }

  const [
    fullArkInterestRatesMap,
    latestArkInterestRatesMap,
    vaultInterestRates,
    positionHistory,
    positionForecastResponse,
    vaultsApyByNetworkMap,
    migratablePositionsData,
    vaultInfo,
    cookieRaw,
  ] = await Promise.all([
    getArksInterestRates({
      network: parsedNetwork,
      arksList: vault.arks.filter(
        (ark): boolean => Number(ark.depositCap) > 0 || Number(ark.inputTokenBalance) > 0,
      ),
    }),
    getArksInterestRates({
      network: parsedNetwork,
      arksList: vault.arks,
      justLatestRates: true,
    }),
    unstableCache(
      getVaultsHistoricalApy,
      ['vaultsHistoricalApy', `${vaultWithConfig.id}-${parsedNetworkId}`],
      cacheConfig,
    )({
      // just the vault displayed
      fleets: [vaultWithConfig].map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
      })),
    }),
    getCachedPositionHistory({
      network: parsedNetwork,
      address: walletAddress.toLowerCase(),
      vault,
    }),
    fetchForecastData({
      fleetAddress: vault.id as `0x${string}`,
      chainId: Number(parsedNetworkId),
      amount: Number(netValue.toFixed(position.amount.token.decimals)),
    }),
    getCachedVaultsApy({
      fleets: allVaultsWithConfig.map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
      })),
    }),
    getCachedMigratablePositions({
      walletAddress,
    }),
    unstableCache(
      getVaultInfo,
      [],
      cacheConfig,
    )({ network: parsedNetwork, vaultAddress: parsedVaultId }),
    cookies(),
  ])

  if (!positionForecastResponse.ok) {
    throw new Error('Failed to fetch forecast data')
  }
  const forecastData = (await positionForecastResponse.json()) as PositionForecastAPIResponse
  const positionForecast = parseForecastDatapoints(forecastData)

  const positionJsonSafe = parseServerResponseToClient<IArmadaPosition>(position)

  const migratablePositions = parseServerResponseToClient(migratablePositionsData)

  const performanceChartData = getPositionPerformanceData({
    vault: vaultWithConfig,
    position: positionJsonSafe,
    positionHistory,
    positionForecast,
  })

  const arksHistoricalChartData = getArkHistoricalChartData({
    vault: vaultWithConfig,
    arkInterestRatesMap: fullArkInterestRatesMap,
    vaultInterestRates,
  })

  const migrationBestVaultApy = getMigrationBestVaultApy({
    migratablePositions,
    vaultsWithConfig: allVaultsWithConfig,
    vaultsApyByNetworkMap,
  })
  const cookie = cookieRaw.toString()
  const sumrNetApyConfig = safeParseJson(getServerSideCookies(sumrNetApyConfigCookieName, cookie))

  const vaultInfoParsed = parseServerResponseToClient(vaultInfo)
  const sumrPriceUsd = getEstimatedSumrPrice({
    config: systemConfig,
    sumrPrice,
    sumrNetApyConfig: sumrNetApyConfig ?? {},
  })

  return (
    <VaultManageView
      systemConfig={systemConfig}
      vault={vaultWithConfig}
      vaults={allVaultsWithConfig}
      vaultsApyByNetworkMap={vaultsApyByNetworkMap}
      position={positionJsonSafe}
      viewWalletAddress={walletAddress}
      latestActivity={latestActivity}
      topDepositors={topDepositors}
      rebalanceActivity={rebalanceActivity}
      performanceChartData={performanceChartData}
      arksHistoricalChartData={arksHistoricalChartData}
      arksInterestRates={latestArkInterestRatesMap}
      migratablePositions={migratablePositions}
      migrationBestVaultApy={migrationBestVaultApy}
      vaultInfo={vaultInfoParsed}
      noOfDeposits={positionHistory.noOfDeposits}
      sumrPriceUsd={sumrPriceUsd}
    />
  )
}

export async function generateMetadata({
  params,
  searchParams,
}: EarnVaultManagePageProps & {
  searchParams: { [key: string]: string | string[] | undefined }
}): Promise<Metadata> {
  const [
    { network: paramsNetwork, vaultId, walletAddress },
    systemConfig,
    headersList,
    searchParamsAwaited,
  ] = await Promise.all([params, getCachedConfig(), headers(), searchParams])
  const parsedNetwork = humanNetworktoSDKNetwork(paramsNetwork)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  const prodHost = headersList.get('host')
  const baseUrl = new URL(`https://${prodHost}`)

  const parsedVaultId = isAddress(vaultId)
    ? vaultId.toLowerCase()
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

  if (!parsedVaultId) {
    return {
      title: `Lazy Summer Protocol - Vault not found`,
      openGraph: {
        siteName: 'Lazy Summer Protocol',
      },
      keywords: getSeoKeywords(),
    }
  }

  const [position, vault] = await Promise.all([
    getUserPosition({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
      walletAddress,
    }),
    getCachedVaultDetails({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
    }),
  ])

  const { netValue } =
    position && vault
      ? getPositionValues({
          position,
          vault,
        })
      : { netValue: 0 }

  const totalSUMREarned = position
    ? new BigNumber(position.claimableSummerToken.amount).plus(
        new BigNumber(position.claimedSummerToken.amount),
      )
    : zero

  let ogImageUrl = ''

  if (typeof searchParamsAwaited.game !== 'undefined') {
    ogImageUrl = `${baseUrl}earn/img/misc/yield_racer.png`
  } else {
    ogImageUrl = `${baseUrl}earn/api/og/vault-position?amount=${formatCryptoBalance(netValue)}&token=${vault ? getDisplayToken(vault.inputToken.symbol) : ''}&address=${walletAddress}&sumrEarned=${formatCryptoBalance(totalSUMREarned)}`
  }

  return {
    title: `Lazy Summer Protocol - ${formatCryptoBalance(netValue)} ${vault ? getDisplayToken(vault.inputToken.symbol) : ''} position on ${capitalize(paramsNetwork)}`,
    openGraph: {
      siteName: 'Lazy Summer Protocol',
      images: ogImageUrl,
    },
  }
}

export default EarnVaultManagePage
