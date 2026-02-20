import { getDisplayToken, Text, VaultGridDetails } from '@summerfi/app-earn-ui'
import { getArksInterestRates, getVaultsHistoricalApy } from '@summerfi/app-server-handlers'
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

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedTvl } from '@/app/server-handlers/cached/get-tvl'
import { getCachedIsVaultDaoManaged } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultDetails } from '@/app/server-handlers/cached/get-vault-details'
import { getCachedVaultsApy } from '@/app/server-handlers/cached/get-vaults-apy'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import { userAddresesToFilterOut } from '@/app/server-handlers/tables-data/consts'
import { getPaginatedLatestActivity } from '@/app/server-handlers/tables-data/latest-activity/api'
import { getPaginatedRebalanceActivity } from '@/app/server-handlers/tables-data/rebalance-activity/api'
import { VaultDetailsView } from '@/components/layout/VaultDetailsView/VaultDetailsView'
import { CACHE_TAGS, CACHE_TIMES } from '@/constants/revalidation'
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
  const [{ network, vaultId }, configRaw] = await Promise.all([params, getCachedConfig()])

  const parsedNetwork = humanNetworktoSDKNetwork(network)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)

  const systemConfig = parseServerResponseToClient(configRaw)

  const parsedVaultId = isAddress(vaultId)
    ? vaultId.toLowerCase()
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

  if (!parsedVaultId || !isAddress(vaultId)) {
    redirect('/not-found')
  }

  const [vault, { vaults }, rebalanceActivity, latestActivity] = await Promise.all([
    getCachedVaultDetails({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
    }),
    getCachedVaultsList(),
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

  if (!vault) {
    return (
      <Text>
        No vault found with the id {parsedVaultId} on the network {parsedNetwork}
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

  const allVaultsWithConfig = decorateVaultsWithConfig({
    vaults,
    systemConfig,
    daoManagedVaultsList,
  })

  const [vaultWithConfig] = decorateVaultsWithConfig({
    vaults: [vault],
    systemConfig,
    daoManagedVaultsList,
  })

  const cacheConfig = {
    revalidate: CACHE_TIMES.INTEREST_RATES,
    tags: [CACHE_TAGS.INTEREST_RATES],
  }

  const [
    fullArkInterestRatesMap,
    latestArkInterestRatesMap,
    vaultInterestRates,
    vaultsApyRaw,
    tvl,
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
      ['vaultsHistoricalApy', `${vault.id}-${parsedNetworkId}`],
      cacheConfig,
    )({
      // just the vault displayed
      fleets: [vaultWithConfig].map(({ id, protocol: { network: protocolNetwork } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(protocolNetwork)),
      })),
    }),
    getCachedVaultsApy({
      fleets: [vaultWithConfig].map(({ id, protocol: { network: protocolNetwork } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(protocolNetwork)),
      })),
    }),
    getCachedTvl(),
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
        totalRebalanceActions={totalRebalanceActions}
        totalUsers={totalUsers}
        vaultApyData={vaultApyData}
        tvl={tvl}
      />
    </VaultGridDetails>
  )
}

export async function generateMetadata({ params }: EarnVaultDetailsPageProps): Promise<Metadata> {
  const [{ network: paramsNetwork, vaultId }, systemConfig] = await Promise.all([
    params,
    getCachedConfig(),
  ])
  const parsedNetwork = humanNetworktoSDKNetwork(paramsNetwork)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)

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

  const [vault] = await Promise.all([
    getCachedVaultDetails({
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
