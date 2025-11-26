import {
  getDisplayToken,
  REVALIDATION_TAGS,
  REVALIDATION_TIMES,
  Text,
  VaultGridDetails,
} from '@summerfi/app-earn-ui'
import {
  configEarnAppFetcher,
  getArksInterestRates,
  getVaultsApy,
  getVaultsHistoricalApy,
} from '@summerfi/app-server-handlers'
import { type SupportedSDKNetworks } from '@summerfi/app-types'
import {
  getVaultNiceName,
  humanNetworktoSDKNetwork,
  parseServerResponseToClient,
  subgraphNetworkToId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import capitalize from 'lodash-es/capitalize'
import { type Metadata } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { redirect } from 'next/navigation'
import { isAddress } from 'viem'

import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { userAddresesToFilterOut } from '@/app/server-handlers/tables-data/consts'
import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { getPaginatedRebalanceActivity } from '@/app/server-handlers/tables-data/rebalance-activity/api'
import { VaultDetailsView } from '@/components/layout/VaultDetailsView/VaultDetailsView'
import { getArkHistoricalChartData } from '@/helpers/chart-helpers/get-ark-historical-data'
import { getSeoKeywords } from '@/helpers/seo-keywords'
import {
  decorateVaultsWithConfig,
  getVaultIdByVaultCustomName,
} from '@/helpers/vault-custom-value-helpers'

type EarnVaultDetailsPageProps = {
  params: Promise<{
    network: SupportedSDKNetworks
    vaultId: string
  }>
}

const EarnVaultDetailsPage = async ({ params }: EarnVaultDetailsPageProps) => {
  const { network, vaultId } = await params

  const parsedNetwork = humanNetworktoSDKNetwork(network)
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

  const [vault, { vaults }, rebalanceActivity, latestActivity] = await Promise.all([
    getVaultDetails({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
    }),
    getVaultsList(),
    // just to get info about total rebalance actions
    getPaginatedRebalanceActivity({
      page: 1,
      limit: 1,
    }),
    // just to get info about total unique users
    getPaginatedLatestActivity({
      page: 1,
      limit: 1,
      filterOutUsersAddresses: userAddresesToFilterOut,
    }),
  ])

  const allVaultsWithConfig = decorateVaultsWithConfig({ vaults, systemConfig })

  if (!vault) {
    return (
      <Text>
        No vault found with the id {parsedVaultId} on the network {parsedNetwork}
      </Text>
    )
  }

  const [vaultWithConfig] = decorateVaultsWithConfig({
    vaults: [vault],
    systemConfig,
  })

  const cacheConfig = {
    revalidate: REVALIDATION_TIMES.INTEREST_RATES,
    tags: [REVALIDATION_TAGS.INTEREST_RATES],
  }

  const keyParts = [vaultId, network]

  const [fullArkInterestRatesMap, latestArkInterestRatesMap, vaultInterestRates, vaultsApyRaw] =
    await Promise.all([
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
        keyParts,
        cacheConfig,
      )({
        // just the vault displayed
        fleets: [vaultWithConfig].map(({ id, protocol: { network: protocolNetwork } }) => ({
          fleetAddress: id,
          chainId: subgraphNetworkToId(supportedSDKNetwork(protocolNetwork)),
        })),
      }),
      unstableCache(
        getVaultsApy,
        keyParts,
        cacheConfig,
      )({
        fleets: [vaultWithConfig].map(({ id, protocol: { network: protocolNetwork } }) => ({
          fleetAddress: id,
          chainId: subgraphNetworkToId(supportedSDKNetwork(protocolNetwork)),
        })),
      }),
    ])

  const arksHistoricalChartData = getArkHistoricalChartData({
    vault: vaultWithConfig,
    arkInterestRatesMap: fullArkInterestRatesMap,
    vaultInterestRates,
  })

  const summerVaultName = getVaultNiceName({ vault: vaultWithConfig })

  const totalRebalanceActions = rebalanceActivity.pagination.totalItems
  const totalUsers = latestActivity.totalUniqueUsers
  const vaultApyData =
    vaultsApyRaw[`${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`]

  return (
    <VaultGridDetails vault={vaultWithConfig} vaults={allVaultsWithConfig}>
      <VaultDetailsView
        arksHistoricalChartData={arksHistoricalChartData}
        summerVaultName={summerVaultName}
        vault={vaultWithConfig}
        arksInterestRates={latestArkInterestRatesMap}
        vaults={vaults}
        totalRebalanceActions={totalRebalanceActions}
        totalUsers={totalUsers}
        vaultApyData={vaultApyData}
      />
    </VaultGridDetails>
  )
}

export async function generateMetadata({ params }: EarnVaultDetailsPageProps): Promise<Metadata> {
  const [{ network: paramsNetwork, vaultId }, systemConfig] = await Promise.all([
    params,
    unstableCache(configEarnAppFetcher, [REVALIDATION_TAGS.CONFIG], {
      revalidate: REVALIDATION_TIMES.CONFIG,
    })(),
  ])
  const parsedNetwork = humanNetworktoSDKNetwork(paramsNetwork)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)

  const parsedVaultId = isAddress(vaultId)
    ? vaultId.toLowerCase()
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

  const [vault] = await Promise.all([
    getVaultDetails({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
    }),
  ])

  const tokenSymbol = vault ? getDisplayToken(vault.inputToken.symbol) : ''

  return {
    title: `Automated ${tokenSymbol} Strategy Details on ${capitalize(paramsNetwork)}`,
    description: `Maximize your DeFi yield with Summer.fi's ${tokenSymbol} automated earning strategy`,
    keywords: getSeoKeywords(tokenSymbol),
  }
}

export default EarnVaultDetailsPage
