import { type FC } from 'react'
import { type SDKNetwork } from '@summerfi/app-types'
import { parseServerResponseToClient, subgraphNetworkToId } from '@summerfi/app-utils'

import { getInterestRates } from '@/app/server-handlers/interest-rates'
import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { getVaultsHistoricalApy } from '@/app/server-handlers/vault-historical-apy'
import { getVaultsApy } from '@/app/server-handlers/vaults-apy'
import { YieldTrendView } from '@/features/yield-trend/components/YieldTrendView'
import { getArkHistoricalChartData } from '@/helpers/chart-helpers/get-ark-historical-data'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

interface YieldTrendPageProps {
  params: Promise<{
    vaultIdWithNetwork?: `${string}-${string}` | undefined
  }>
}

export const YieldTrendPage: FC<YieldTrendPageProps> = async ({ params: paramsPromise }) => {
  const { vaultIdWithNetwork } = await paramsPromise
  const [{ vaults }, configRaw] = await Promise.all([getVaultsList(), systemConfigHandler()])
  const { config: systemConfig } = parseServerResponseToClient(configRaw)

  const vaultsWithConfig = decorateVaultsWithConfig({
    systemConfig,
    vaults,
  })

  const selectedVaultId =
    vaultIdWithNetwork?.split('-')[0] ??
    `${vaultsWithConfig[0].id}-${subgraphNetworkToId(vaultsWithConfig[0].protocol.network)}`

  const selectedVault = vaultIdWithNetwork
    ? vaultsWithConfig.find(
        (vault) => vault.id === selectedVaultId || vault.customFields?.name === selectedVaultId,
      )
    : vaultsWithConfig[0]

  if (!selectedVault) {
    throw new Error(`Vault with ID ${selectedVaultId} not found`)
  }

  const parsedNetwork = selectedVault.protocol.network as SDKNetwork

  const [arkInterestRatesMap, vaultInterestRates, vaultsApyByNetworkMap] = await Promise.all([
    getInterestRates({
      network: parsedNetwork,
      arksList: selectedVault.arks,
    }),
    getVaultsHistoricalApy({
      // just the vault displayed
      fleets: [selectedVault].map(({ id, protocol: { network: protocolNetwork } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(protocolNetwork),
      })),
    }),
    getVaultsApy({
      fleets: vaultsWithConfig.map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(network),
      })),
    }),
  ])

  const arksHistoricalChartData = getArkHistoricalChartData({
    vault: selectedVault,
    arkInterestRatesMap,
    vaultInterestRates,
  })

  return (
    <YieldTrendView
      vaults={vaultsWithConfig}
      vaultsApyByNetworkMap={vaultsApyByNetworkMap}
      arksHistoricalChartData={arksHistoricalChartData}
      selectedVault={selectedVault}
    />
  )
}
