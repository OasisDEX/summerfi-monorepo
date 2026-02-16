import {
  getDisplayToken,
  isVaultAtLeastDaysOld,
  sumrNetApyConfigCookieName,
  Text,
} from '@summerfi/app-earn-ui'
import {
  getArksInterestRates,
  getVaultInfo,
  getVaultsHistoricalApy,
} from '@summerfi/app-server-handlers'
import { type SDKVaultishType, SupportedSDKNetworks } from '@summerfi/app-types'
import {
  formatCryptoBalance,
  formatDecimalAsPercent,
  getServerSideCookies,
  humanNetworktoSDKNetwork,
  parseServerResponseToClient,
  safeParseJson,
  subgraphNetworkToId,
  supportedSDKNetwork,
  ten,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { capitalize } from 'lodash-es'
import { type Metadata } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAddress } from 'viem'

import { getCachedMedianDefiYield } from '@/app/server-handlers/cached/defillama/get-median-defi-yield'
import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedIsVaultDaoManaged } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultsApy } from '@/app/server-handlers/cached/get-vaults-apy'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { getTestVaultData } from '@/app/server-handlers/sdk/get-test-vault-data'
import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { getCachedSumrPrice } from '@/app/server-handlers/sumr-price'
import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { getPaginatedRebalanceActivity } from '@/app/server-handlers/tables-data/rebalance-activity/api'
import { getPaginatedTopDepositors } from '@/app/server-handlers/tables-data/top-depositors/api'
import { VaultOpenView } from '@/components/layout/VaultOpenView/VaultOpenView'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'
import { getArkHistoricalChartData } from '@/helpers/chart-helpers/get-ark-historical-data'
import { getEstimatedSumrPrice } from '@/helpers/get-estimated-sumr-price'
import { getSeoKeywords } from '@/helpers/seo-keywords'
import {
  decorateVaultsWithConfig,
  getVaultIdByVaultCustomName,
} from '@/helpers/vault-custom-value-helpers'

type EarnVaultOpenPageProps = {
  params: Promise<{
    vaultId: string // could be vault address or the vault name
    network: SupportedSDKNetworks
  }>
}

const EarnVaultOpenPage = async ({ params }: EarnVaultOpenPageProps) => {
  const [{ network: paramsNetwork, vaultId }, cookieRaw, configRaw] = await Promise.all([
    params,
    cookies(),
    getCachedConfig(),
  ])
  const parsedNetwork = humanNetworktoSDKNetwork(paramsNetwork)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  const systemConfig = parseServerResponseToClient(configRaw)
  const cookie = cookieRaw.toString()

  const referralCode = getServerSideCookies('referralCode', cookie)

  const parsedVaultId = isAddress(vaultId)
    ? vaultId.toLowerCase()
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

  if (!parsedVaultId) {
    redirect('/not-found')
  }

  const strategy = `${parsedVaultId}-${parsedNetwork}`

  const [
    vault,
    { vaults },
    medianDefiYield,
    topDepositors,
    latestActivity,
    rebalanceActivity,
    sumrPrice,
    isDaoManaged,
  ] = await Promise.all([
    getVaultDetails({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
    }),
    getCachedVaultsList(),
    getCachedMedianDefiYield(),
    getPaginatedTopDepositors({
      page: 1,
      limit: 4,
      strategies: [strategy],
    }),
    getPaginatedLatestActivity({
      page: 1,
      limit: 4,
      strategies: [strategy],
    }),
    getPaginatedRebalanceActivity({
      page: 1,
      limit: 4,
      strategies: [strategy],
      startTimestamp: dayjs().subtract(30, 'days').unix(),
    }),
    getCachedSumrPrice(),
    getCachedIsVaultDaoManaged({
      fleetAddress: parsedVaultId,
      network: parsedNetwork,
    }),
  ])

  if (
    !vault &&
    parsedVaultId.toLowerCase() !== '0x218f3255fa97a60bf99f175c9c5c56fdf06b15fc'.toLowerCase()
  ) {
    return (
      <Text>
        No vault found with the id {parsedVaultId} on the network {parsedNetwork}
      </Text>
    )
  }

  let testVaultData: SDKVaultishType | undefined

  if (
    parsedVaultId.toLowerCase() === '0x218f3255fa97a60bf99f175c9c5c56fdf06b15fc'.toLowerCase() &&
    parsedNetwork === SupportedSDKNetworks.Mainnet
  ) {
    testVaultData = getTestVaultData()
  }

  const [vaultWithConfig] = decorateVaultsWithConfig({
    vaults: [testVaultData ? testVaultData : (vault as SDKVaultishType)],
    systemConfig,
  })

  const allVaultsWithConfig = decorateVaultsWithConfig({ vaults, systemConfig })

  const cacheConfig = {
    revalidate: CACHE_TIMES.INTEREST_RATES,
    tags: [CACHE_TAGS.INTEREST_RATES],
  }

  const [
    fullArkInterestRatesMap,
    latestArkInterestRatesMap,
    vaultInterestRates,
    vaultsApyRaw,
    vaultInfo,
  ] = await Promise.all([
    getArksInterestRates({
      network: parsedNetwork,
      arksList: vaultWithConfig.arks.filter(
        (ark): boolean => Number(ark.depositCap) > 0 || Number(ark.inputTokenBalance) > 0,
      ),
    }),
    getArksInterestRates({
      network: parsedNetwork,
      arksList: vaultWithConfig.arks,
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
    getCachedVaultsApy({
      fleets: allVaultsWithConfig.map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
      })),
    }),
    unstableCache(
      getVaultInfo,
      ['vaultInfo', parsedNetwork, parsedVaultId],
      cacheConfig,
    )({ network: parsedNetwork, vaultAddress: parsedVaultId }),
  ])

  const arksHistoricalChartData = getArkHistoricalChartData({
    vault: vaultWithConfig,
    arkInterestRatesMap: fullArkInterestRatesMap,
    vaultInterestRates,
  })

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const vaultApyData = vaultsApyRaw[
    `${vaultWithConfig.id}-${subgraphNetworkToId(supportedSDKNetwork(vaultWithConfig.protocol.network))}`
  ] || { sma7d: null, sma30d: null, current: null }

  const sumrNetApyConfig = safeParseJson(getServerSideCookies(sumrNetApyConfigCookieName, cookie))
  const vaultInfoParsed = parseServerResponseToClient(vaultInfo)
  const sumrPriceUsd = getEstimatedSumrPrice({
    config: systemConfig,
    sumrPrice,
    sumrNetApyConfig: sumrNetApyConfig ?? {},
  })

  return (
    <VaultOpenView
      vault={vaultWithConfig}
      vaults={allVaultsWithConfig}
      latestActivity={latestActivity}
      topDepositors={topDepositors}
      rebalanceActivity={rebalanceActivity}
      medianDefiYield={medianDefiYield}
      arksHistoricalChartData={arksHistoricalChartData}
      arksInterestRates={latestArkInterestRatesMap}
      vaultApyData={vaultApyData}
      vaultsApyRaw={vaultsApyRaw}
      referralCode={referralCode}
      vaultInfo={vaultInfoParsed}
      sumrPriceUsd={sumrPriceUsd}
      isDaoManaged={isDaoManaged}
    />
  )
}

export async function generateMetadata({
  params,
  searchParams,
}: EarnVaultOpenPageProps & {
  searchParams: { [key: string]: string | string[] | undefined }
}): Promise<Metadata> {
  const [{ network: paramsNetwork, vaultId }, systemConfig, headersList, searchParamsAwaited] =
    await Promise.all([params, getCachedConfig(), headers(), searchParams])
  const parsedNetwork = humanNetworktoSDKNetwork(paramsNetwork)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  const prodHost = headersList.get('host')
  const baseUrl = new URL(`https://${prodHost}`)

  const parsedVaultId = isAddress(vaultId)
    ? vaultId.toLowerCase()
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

  const [vault] = await Promise.all([
    getVaultDetails({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
    }),
  ])

  if (!vault) {
    return {
      title: `Lazy Summer Protocol - Vault not found`,
      openGraph: {
        siteName: 'Lazy Summer Protocol',
      },
      keywords: getSeoKeywords(),
    }
  }

  const [vaultWithConfig] = decorateVaultsWithConfig({
    vaults: [vault],
    systemConfig,
  })

  const [vaultsApyRaw] = await Promise.all([
    getCachedVaultsApy({
      fleets: [vaultWithConfig].map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
      })),
    }),
  ])

  const vaultApyData =
    vaultsApyRaw[
      `${vaultWithConfig.id}-${subgraphNetworkToId(supportedSDKNetwork(vaultWithConfig.protocol.network))}`
    ]

  const totalValueLockedTokenParsed = formatCryptoBalance(
    new BigNumber(vault.inputTokenBalance.toString()).div(ten.pow(vault.inputToken.decimals)),
  )

  const isVaultAtLeast30dOld = isVaultAtLeastDaysOld({ vault: vaultWithConfig, days: 30 })

  const apy30d = isVaultAtLeast30dOld
    ? vaultApyData.sma30d
      ? formatDecimalAsPercent(vaultApyData.sma30d, { noPercentSign: true })
      : 'n/a'
    : 'New'

  let ogImageUrl = ''

  if (typeof searchParamsAwaited.game !== 'undefined') {
    ogImageUrl = `${baseUrl}earn/img/misc/yield_racer.png`
  } else {
    ogImageUrl = `${baseUrl}earn/api/og/vault?tvl=${totalValueLockedTokenParsed}&apy30d=${apy30d}&token=${vaultWithConfig.inputToken.symbol}`
  }

  return {
    title: `Lazy Summer Protocol - ${getDisplayToken(vault.inputToken.symbol)} on ${capitalize(paramsNetwork)}, $${totalValueLockedTokenParsed} TVL`,
    openGraph: {
      siteName: 'Lazy Summer Protocol',
      images: ogImageUrl,
    },
    keywords: getSeoKeywords(),
  }
}

export default EarnVaultOpenPage
