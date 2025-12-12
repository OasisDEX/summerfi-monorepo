import {
  getDisplayToken,
  isVaultAtLeastDaysOld,
  REVALIDATION_TAGS,
  REVALIDATION_TIMES,
  Text,
} from '@summerfi/app-earn-ui'
import {
  getArksInterestRates,
  getVaultInfo,
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

import { getCachedConfig } from '@/app/server-handlers/cached/config'
import { getCachedVaultsApy } from '@/app/server-handlers/cached/get-vaults-apy'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { getMedianDefiYield } from '@/app/server-handlers/defillama/get-median-defi-yield'
import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
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

  const [vault, { vaults }, medianDefiYield, topDepositors, latestActivity, rebalanceActivity] =
    await Promise.all([
      getVaultDetails({
        vaultAddress: parsedVaultId,
        network: parsedNetwork,
      }),
      getCachedVaultsList(),
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

  const [
    fullArkInterestRatesMap,
    latestArkInterestRatesMap,
    vaultInterestRates,
    vaultsApyRaw,
    vaultInfo,
  ] = await Promise.all([
    vault?.arks
      ? getArksInterestRates({
          network: parsedNetwork,
          arksList: vault.arks.filter(
            (ark): boolean => Number(ark.depositCap) > 0 || Number(ark.inputTokenBalance) > 0,
          ),
        })
      : Promise.resolve({}),
    vault?.arks
      ? getArksInterestRates({
          network: parsedNetwork,
          arksList: vault.arks,
          justLatestRates: true,
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
    getCachedVaultsApy({
      fleets: allVaultsWithConfig.map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
      })),
    }),
    unstableCache(
      getVaultInfo,
      keyParts,
      cacheConfig,
    )({ network: parsedNetwork, vaultAddress: parsedVaultId }),
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
    arkInterestRatesMap: fullArkInterestRatesMap,
    vaultInterestRates,
  })

  const vaultApyData =
    vaultsApyRaw[`${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`]

  const vaultInfoParsed = parseServerResponseToClient(vaultInfo)

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

  const [vaultWithConfig] = vault
    ? decorateVaultsWithConfig({
        vaults: [vault],
        systemConfig,
      })
    : []

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
