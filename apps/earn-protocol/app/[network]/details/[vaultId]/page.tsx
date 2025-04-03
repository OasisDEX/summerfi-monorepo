import { Text, VaultGridDetails } from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'
import {
  humanNetworktoSDKNetwork,
  parseServerResponseToClient,
  subgraphNetworkToId,
} from '@summerfi/app-utils'
import { redirect } from 'next/navigation'
import { isAddress } from 'viem'

import { getInterestRates } from '@/app/server-handlers/interest-rates'
import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { userAddresesToFilterOut } from '@/app/server-handlers/tables-data/consts'
import { getPaginatedRebalanceActivity } from '@/app/server-handlers/tables-data/rebalance-activity/api'
import { getPaginatedTopDepositors } from '@/app/server-handlers/tables-data/top-depositors/api'
import { getVaultsHistoricalApy } from '@/app/server-handlers/vault-historical-apy'
import { VaultDetailsView } from '@/components/layout/VaultDetailsView/VaultDetailsView'
import { getArkHistoricalChartData } from '@/helpers/chart-helpers/get-ark-historical-data'
import {
  decorateVaultsWithConfig,
  getVaultIdByVaultCustomName,
} from '@/helpers/vault-custom-value-helpers'

type EarnVaultDetailsPageProps = {
  params: Promise<{
    network: SDKNetwork
    vaultId: string
  }>
}

const EarnVaultDetailsPage = async ({ params }: EarnVaultDetailsPageProps) => {
  const { network, vaultId } = await params

  const parsedNetwork = humanNetworktoSDKNetwork(network)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  const { config: systemConfig } = parseServerResponseToClient(await systemConfigHandler())

  const parsedVaultId = isAddress(vaultId)
    ? vaultId.toLowerCase()
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

  if (!parsedVaultId && !isAddress(vaultId)) {
    redirect('/not-found')
  }

  const [vault, { vaults }, rebalanceActivity, topDepositors] = await Promise.all([
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
    // just to get info about total users
    getPaginatedTopDepositors({
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

  const [arkInterestRatesMap, vaultInterestRates] = await Promise.all([
    getInterestRates({
      network: parsedNetwork,
      arksList: vault.arks,
    }),
    getVaultsHistoricalApy({
      // just the vault displayed
      fleets: [vaultWithConfig].map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(network),
      })),
    }),
  ])

  const arksHistoricalChartData = getArkHistoricalChartData({
    vault: vaultWithConfig,
    arkInterestRatesMap,
    vaultInterestRates,
  })

  const summerVaultName = vault.customFields?.name ?? `Summer ${vault.inputToken.symbol} Vault`

  const totalRebalanceActions = rebalanceActivity.pagination.totalItems
  const totalUsers = topDepositors.pagination.totalItems

  return (
    <VaultGridDetails vault={vault} vaults={allVaultsWithConfig}>
      <VaultDetailsView
        arksHistoricalChartData={arksHistoricalChartData}
        summerVaultName={summerVaultName}
        vault={vault}
        arksInterestRates={arkInterestRatesMap}
        vaults={vaults}
        totalRebalanceActions={totalRebalanceActions}
        totalUsers={totalUsers}
      />
    </VaultGridDetails>
  )
}

export default EarnVaultDetailsPage
