import {
  fetchForecastData,
  getDisplayToken,
  getPositionValues,
  parseForecastDatapoints,
  REVALIDATION_TAGS,
  REVALIDATION_TIMES,
  Text,
} from '@summerfi/app-earn-ui'
import {
  configEarnAppFetcher,
  getArksInterestRates,
  getVaultsApy,
  getVaultsHistoricalApy,
} from '@summerfi/app-server-handlers'
import {
  type IArmadaPosition,
  type PositionForecastAPIResponse,
  type SupportedSDKNetworks,
} from '@summerfi/app-types'
import {
  formatCryptoBalance,
  humanNetworktoSDKNetwork,
  parseServerResponseToClient,
  subgraphNetworkToId,
  supportedSDKNetwork,
  zero,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { capitalize } from 'lodash-es'
import { type Metadata } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAddress } from 'viem'

import { getMigratablePositions } from '@/app/server-handlers/migration'
import { getPositionHistory } from '@/app/server-handlers/position-history'
import { getPositionsActivePeriods } from '@/app/server-handlers/positions-active-periods'
import { getUserPosition } from '@/app/server-handlers/sdk/get-user-position'
import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { getPaginatedRebalanceActivity } from '@/app/server-handlers/tables-data/rebalance-activity/api'
import { getPaginatedTopDepositors } from '@/app/server-handlers/tables-data/top-depositors/api'
import { VaultManageView } from '@/components/layout/VaultManageView/VaultManageView'
import { getMigrationBestVaultApy } from '@/features/migration/helpers/get-migration-best-vault-apy'
import { getArkHistoricalChartData } from '@/helpers/chart-helpers/get-ark-historical-data'
import { getPositionPerformanceData } from '@/helpers/chart-helpers/get-position-performance-data'
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
  const { network: paramsNetwork, vaultId, walletAddress } = await params
  const parsedNetwork = humanNetworktoSDKNetwork(paramsNetwork)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  const configRaw = await unstableCache(configEarnAppFetcher, [REVALIDATION_TAGS.CONFIG], {
    revalidate: REVALIDATION_TIMES.CONFIG,
  })()
  const systemConfig = parseServerResponseToClient(configRaw)

  const parsedVaultId = isAddress(vaultId)
    ? vaultId.toLowerCase()
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

  if (!parsedVaultId && !isAddress(vaultId)) {
    redirect('/not-found')
  }
  if (!isAddress(walletAddress)) {
    redirect('/not-found')
  }

  const strategy = `${parsedVaultId}-${parsedNetwork}`

  const [vault, { vaults }, position, topDepositors, latestActivity, rebalanceActivity] =
    await Promise.all([
      getVaultDetails({
        vaultAddress: parsedVaultId,
        network: parsedNetwork,
      }),
      getVaultsList(),
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
      getPositionsActivePeriods(walletAddress).then((periods) => {
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

  const [vaultWithConfig] = decorateVaultsWithConfig({
    vaults: [vault],
    systemConfig,
  })

  const allVaultsWithConfig = decorateVaultsWithConfig({ vaults, systemConfig })

  const { netValue } = getPositionValues({
    position,
    vault,
  })

  const cacheConfig = {
    revalidate: REVALIDATION_TIMES.INTEREST_RATES,
    tags: [REVALIDATION_TAGS.INTEREST_RATES],
  }

  const keyParts = [walletAddress, vaultId, paramsNetwork]

  const [
    arkInterestRatesMap,
    vaultInterestRates,
    positionHistory,
    positionForecastResponse,
    vaultsApyByNetworkMap,
    migratablePositionsData,
  ] = await Promise.all([
    unstableCache(
      getArksInterestRates,
      keyParts,
      cacheConfig,
    )({
      network: parsedNetwork,
      arksList: vault.arks,
    }),
    unstableCache(
      getVaultsHistoricalApy,
      keyParts,
      cacheConfig,
    )({
      // just the vault displayed
      fleets: [vaultWithConfig].map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
      })),
    }),
    getPositionHistory({
      network: parsedNetwork,
      address: walletAddress.toLowerCase(),
      vault,
    }),
    fetchForecastData({
      fleetAddress: vault.id as `0x${string}`,
      chainId: Number(parsedNetworkId),
      amount: Number(netValue.toFixed(position.amount.token.decimals)),
    }),
    unstableCache(
      getVaultsApy,
      keyParts,
      cacheConfig,
    )({
      fleets: allVaultsWithConfig.map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
      })),
    }),
    getMigratablePositions({
      walletAddress,
    }),
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
    arkInterestRatesMap,
    vaultInterestRates,
  })

  const migrationBestVaultApy = getMigrationBestVaultApy({
    migratablePositions,
    vaultsWithConfig: allVaultsWithConfig,
    vaultsApyByNetworkMap,
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
      arksInterestRates={arkInterestRatesMap}
      migratablePositions={migratablePositions}
      migrationBestVaultApy={migrationBestVaultApy}
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
  ] = await Promise.all([
    params,
    unstableCache(configEarnAppFetcher, [REVALIDATION_TAGS.CONFIG], {
      revalidate: REVALIDATION_TIMES.CONFIG,
    })(),
    headers(),
    searchParams,
  ])
  const parsedNetwork = humanNetworktoSDKNetwork(paramsNetwork)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  const prodHost = headersList.get('host')
  const baseUrl = new URL(`https://${prodHost}`)

  const parsedVaultId = isAddress(vaultId)
    ? vaultId.toLowerCase()
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

  const [position, vault] = await Promise.all([
    getUserPosition({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
      walletAddress,
    }),
    getVaultDetails({
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

  const sumrReward = position?.rewards.find((reward) => {
    return reward.claimed.token.symbol === 'SUMR'
  })

  const totalSUMREarned = sumrReward
    ? new BigNumber(sumrReward.claimable.amount).plus(new BigNumber(sumrReward.claimed.amount))
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
