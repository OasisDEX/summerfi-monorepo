import { Text } from '@summerfi/app-earn-ui'
import { type SDKNetwork } from '@summerfi/app-types'
import {
  humanNetworktoSDKNetwork,
  parseServerResponseToClient,
  subgraphNetworkToId,
} from '@summerfi/app-utils'
import { isAddress } from 'viem'

import { getMedianDefiYield } from '@/app/server-handlers/defillama/get-median-defi-yield'
import { getInterestRates } from '@/app/server-handlers/interest-rates'
import { getUserActivity } from '@/app/server-handlers/sdk/get-user-activity'
import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { VaultOpenView } from '@/components/layout/VaultOpenView/VaultOpenView'
import { getArkHistoricalChartData } from '@/helpers/chart-helpers/get-ark-historical-data'
import { mapArkLatestInterestRates } from '@/helpers/map-ark-interest-rates'
import {
  decorateVaultsWithConfig,
  getVaultIdByVaultCustomName,
} from '@/helpers/vault-custom-value-helpers'

type EarnVaultOpenPageProps = {
  params: Promise<{
    vaultId: string // could be vault address or the vault name
    network: SDKNetwork
  }>
}

const EarnVaultOpenPage = async ({ params }: EarnVaultOpenPageProps) => {
  const { network, vaultId } = await params
  const parsedNetwork = humanNetworktoSDKNetwork(network)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  const { config: systemConfig } = parseServerResponseToClient(await systemConfigHandler())

  const parsedVaultId = isAddress(vaultId)
    ? vaultId
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

  const [vault, { vaults }, { userActivity, topDepositors }, medianDefiYield] = await Promise.all([
    getVaultDetails({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
    }),
    getVaultsList(),
    getUserActivity({ vaultAddress: parsedVaultId, network: parsedNetwork }),
    getMedianDefiYield(),
  ])

  const interestRates = vault?.arks
    ? await getInterestRates({
        network: parsedNetwork,
        arksList: vault.arks,
      })
    : {}

  const [vaultWithConfig] = vault
    ? decorateVaultsWithConfig({
        vaults: [vault],
        systemConfig,
      })
    : []
  const allVaultsWithConfig = decorateVaultsWithConfig({ vaults, systemConfig })

  if (!vault) {
    return (
      <Text>
        No vault found with the id {parsedVaultId} on the network {parsedNetwork}
      </Text>
    )
  }

  const arksHistoricalChartData = getArkHistoricalChartData({
    vault: vaultWithConfig,
    arkInterestRatesMap: interestRates,
  })

  const arksInterestRates = mapArkLatestInterestRates(interestRates)

  return (
    <VaultOpenView
      vault={vaultWithConfig}
      vaults={allVaultsWithConfig}
      userActivity={userActivity}
      topDepositors={topDepositors}
      medianDefiYield={medianDefiYield}
      arksHistoricalChartData={arksHistoricalChartData}
      arksInterestRates={arksInterestRates}
    />
  )
}

export default EarnVaultOpenPage
