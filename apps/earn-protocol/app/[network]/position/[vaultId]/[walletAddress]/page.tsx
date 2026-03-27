import {
  fetchForecastData,
  getDisplayToken,
  getPositionValues,
  parseForecastDatapoints,
  Text,
} from '@summerfi/app-earn-ui'
import { getArksInterestRates } from '@summerfi/app-server-handlers'
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
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAddress } from 'viem'

import { getCachedClaimableWSTETHMerkleRewards } from '@/app/server-handlers/cached/claimable-merkle-rewards'
import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedPositionHistory } from '@/app/server-handlers/cached/get-position-history'
import { getCachedPositionsActivePeriods } from '@/app/server-handlers/cached/get-positions-active-periods'
import { getDaoManagedVaultsIDsList } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultDetails } from '@/app/server-handlers/cached/get-vault-details'
import { getCachedVaultInfo } from '@/app/server-handlers/cached/get-vault-info'
import { getCachedVaultsApy } from '@/app/server-handlers/cached/get-vaults-apy'
import { getCachedVaultsBenchmark } from '@/app/server-handlers/cached/get-vaults-benchmark'
import { getCachedVaultsHistoricalApy } from '@/app/server-handlers/cached/get-vaults-historical-apy'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { getCachedMigratablePositions } from '@/app/server-handlers/cached/migration'
import { getCachedRewardTokenPrice } from '@/app/server-handlers/reward-token-price'
import { getUserPosition } from '@/app/server-handlers/sdk/get-user-position'
import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { getPaginatedRebalanceActivity } from '@/app/server-handlers/tables-data/rebalance-activity/api'
import { getPaginatedTopDepositors } from '@/app/server-handlers/tables-data/top-depositors/api'
import { VaultManageView } from '@/components/layout/VaultManageView/VaultManageView'
import { getMigrationBestVaultApy } from '@/features/migration/helpers/get-migration-best-vault-apy'
import { getArkHistoricalChartData } from '@/helpers/chart-helpers/get-ark-historical-data'
import { getPositionPerformanceData } from '@/helpers/chart-helpers/get-position-performance-data'
import {
  getMerkleNowClaimableTokenAddress,
  getMerkleNowClaimableTokenAmount,
} from '@/helpers/merkle'
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
  const [{ network: paramsNetwork, vaultId, walletAddress }, configRaw] = await Promise.all([
    params,
    getCachedConfig(),
  ])
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

  const { netValue } = getPositionValues({
    position,
    vault,
  })

  // Fetch DAO managed vaults, vault info, and ark rates in parallel
  const [
    { chartData: vaultBenchmark },
    daoManagedVaultsList,
    vaultInfo,
    fullArkInterestRatesMap,
    latestArkInterestRatesMap,
    vaultInterestRates,
    positionHistory,
    positionForecastResponse,
    migratablePositionsData,
    rewardTokenPrices,
    claimableWSTETHMerkleRewards,
  ] = await Promise.all([
    getCachedVaultsBenchmark({
      vaultChainId: subgraphNetworkToId(parsedNetwork),
      vaultToken: vault.inputToken.symbol,
    }),
    getDaoManagedVaultsIDsList(vaults),
    getCachedVaultInfo({ network: parsedNetwork, vaultAddress: parsedVaultId }),
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
    getCachedVaultsHistoricalApy({
      // just the vault displayed
      fleets: [{ id: parsedVaultId, protocol: { network: parsedNetwork } }].map(
        ({ id, protocol: { network } }) => ({
          fleetAddress: id,
          chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
        }),
      ),
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
    getCachedMigratablePositions({
      walletAddress,
    }),
    getCachedRewardTokenPrice(),
    getCachedClaimableWSTETHMerkleRewards(walletAddress),
  ])

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

  // Fetch APY data for all vaults
  const vaultsApyByNetworkMap = await getCachedVaultsApy({
    fleets: allVaultsWithConfig.map(({ id, protocol: { network } }) => ({
      fleetAddress: id,
      chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
    })),
  })

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
    vaultBenchmark,
  })

  const migrationBestVaultApy = getMigrationBestVaultApy({
    migratablePositions,
    vaultsWithConfig: allVaultsWithConfig,
    vaultsApyByNetworkMap,
  })
  const vaultInfoParsed = parseServerResponseToClient(vaultInfo)

  const rewardTokenVisibilityMap = {
    // we only show the WSTETH rewards for ETH Dao managed vault
    WSTETH: vault.id.toLowerCase() === '0x0c1fbccc019320032d9acd193447560c8c632114'.toLowerCase() && Number(parsedNetworkId) === 1,
  }

  const rewardTokensClaimableNow: {
    [tokenSymbol: string]: { amount: number; tokenAddress: string }
  } = {
    WSTETH: rewardTokenVisibilityMap.WSTETH ? {
      amount: getMerkleNowClaimableTokenAmount(
        claimableWSTETHMerkleRewards.perChain['1'],
        'wstETH',
      ),
      tokenAddress: getMerkleNowClaimableTokenAddress(
        claimableWSTETHMerkleRewards.perChain['1'],
        'wstETH',
      ),
    } : { amount: 0, tokenAddress: '' },
  }

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
      rewardTokenPrices={rewardTokenPrices}
      rewardTokensClaimableNow={rewardTokensClaimableNow}
    />
  )
}

export async function generateMetadata({
  params,
  searchParams,
}: EarnVaultManagePageProps & {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
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
