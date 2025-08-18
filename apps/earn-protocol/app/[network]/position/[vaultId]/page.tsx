import {
  getDisplayToken,
  isVaultAtLeastDaysOld,
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
import { type SupportedSDKNetworks } from '@summerfi/app-types'
import {
  formatCryptoBalance,
  formatDecimalAsPercent,
  getServerSideCookies,
  humanNetworktoSDKNetwork,
  parseServerResponseToClient,
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

import { getMedianDefiYield } from '@/app/server-handlers/defillama/get-median-defi-yield'
import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { getPaginatedRebalanceActivity } from '@/app/server-handlers/tables-data/rebalance-activity/api'
import { getPaginatedTopDepositors } from '@/app/server-handlers/tables-data/top-depositors/api'
import { VaultOpenView } from '@/components/layout/VaultOpenView/VaultOpenView'
import { getArkHistoricalChartData } from '@/helpers/chart-helpers/get-ark-historical-data'
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
  const { network: paramsNetwork, vaultId } = await params
  const parsedNetwork = humanNetworktoSDKNetwork(paramsNetwork)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  const configRaw = await unstableCache(configEarnAppFetcher, [REVALIDATION_TAGS.CONFIG], {
    revalidate: REVALIDATION_TIMES.CONFIG,
  })()
  const systemConfig = parseServerResponseToClient(configRaw)

  const cookieRaw = await cookies()
  const cookie = cookieRaw.toString()

  const referralCode = getServerSideCookies('referralCode', cookie)

  const parsedVaultId = isAddress(vaultId)
    ? vaultId.toLowerCase()
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

  if (!parsedVaultId && !isAddress(vaultId)) {
    redirect('/not-found')
  }

  const strategy = `${parsedVaultId}-${parsedNetwork}`

  const [vault, { vaults }, medianDefiYield, topDepositors, latestActivity, rebalanceActivity] =
    await Promise.all([
      getVaultDetails({
        vaultAddress: parsedVaultId,
        network: parsedNetwork,
      }),
      getVaultsList(),
      getMedianDefiYield(),
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
    ])

  const [vaultWithConfig] = vault
    ? decorateVaultsWithConfig({
        vaults: [vault],
        systemConfig,
      })
    : []

  const allVaultsWithConfig = decorateVaultsWithConfig({ vaults, systemConfig })

  const cacheConfig = {
    revalidate: REVALIDATION_TIMES.INTEREST_RATES,
    tags: [REVALIDATION_TAGS.INTEREST_RATES],
  }
  const keyParts = [vaultId, paramsNetwork]

  const [arkInterestRatesMap, vaultInterestRates, vaultsApyRaw] = await Promise.all([
    vault?.arks
      ? unstableCache(
          getArksInterestRates,
          keyParts,
          cacheConfig,
        )({
          network: parsedNetwork,
          arksList: vault.arks,
        })
      : Promise.resolve({}),
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
  ])

  if (!vault) {
    return (
      <Text>
        No vault found with the id {parsedVaultId} on the network {parsedNetwork}
      </Text>
    )
  }

  const arksHistoricalChartData = getArkHistoricalChartData({
    vault: vaultWithConfig,
    arkInterestRatesMap,
    vaultInterestRates,
  })

  const vaultApyData =
    vaultsApyRaw[`${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`]

  return (
    <VaultOpenView
      vault={vaultWithConfig}
      vaults={allVaultsWithConfig}
      latestActivity={latestActivity}
      topDepositors={topDepositors}
      rebalanceActivity={rebalanceActivity}
      medianDefiYield={medianDefiYield}
      arksHistoricalChartData={arksHistoricalChartData}
      arksInterestRates={arkInterestRatesMap}
      vaultApyData={vaultApyData}
      vaultsApyRaw={vaultsApyRaw}
      referralCode={referralCode}
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
    await Promise.all([
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

  const [vault] = await Promise.all([
    getVaultDetails({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
    }),
  ])

  const [vaultWithConfig] = vault
    ? decorateVaultsWithConfig({
        vaults: [vault],
        systemConfig,
      })
    : []

  const [vaultsApyRaw] = await Promise.all([
    unstableCache(getVaultsApy, [REVALIDATION_TAGS.INTEREST_RATES], {
      revalidate: REVALIDATION_TIMES.INTEREST_RATES,
    })({
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

  const totalValueLockedTokenParsed = vault
    ? formatCryptoBalance(
        new BigNumber(vault.inputTokenBalance.toString()).div(ten.pow(vault.inputToken.decimals)),
      )
    : ''

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
    title: `Lazy Summer Protocol - ${vault ? getDisplayToken(vault.inputToken.symbol) : ''} on ${capitalize(paramsNetwork)}, $${totalValueLockedTokenParsed} TVL`,
    openGraph: {
      siteName: 'Lazy Summer Protocol',
      images: ogImageUrl,
    },
    keywords: getSeoKeywords(),
  }
}

export default EarnVaultOpenPage
