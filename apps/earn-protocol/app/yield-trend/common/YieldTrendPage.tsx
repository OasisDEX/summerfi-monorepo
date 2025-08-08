import { type FC } from 'react'
import { getArksInterestRates, getVaultsApy } from '@summerfi/app-server-handlers'
import {
  parseServerResponseToClient,
  subgraphNetworkToId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { getVaultsHistoricalApy } from '@/app/server-handlers/vault-historical-apy'
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
    `${vaultsWithConfig[0].id}-${subgraphNetworkToId(supportedSDKNetwork(vaultsWithConfig[0].protocol.network))}`

  const selectedVault = vaultIdWithNetwork
    ? vaultsWithConfig.find(
        (vault) => vault.id === selectedVaultId || vault.customFields?.name === selectedVaultId,
      )
    : vaultsWithConfig[0]

  if (!selectedVault) {
    throw new Error(`Vault with ID ${selectedVaultId} not found`)
  }

  const parsedNetwork = supportedSDKNetwork(selectedVault.protocol.network)

  const [arkInterestRatesMap, vaultInterestRates, vaultsApyByNetworkMap] = await Promise.all([
    getArksInterestRates({
      network: parsedNetwork,
      arksList: selectedVault.arks,
    }),
    getVaultsHistoricalApy({
      // just the vault displayed
      fleets: [selectedVault].map(({ id, protocol: { network: protocolNetwork } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(protocolNetwork)),
      })),
    }),
    getVaultsApy({
      fleets: vaultsWithConfig.map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
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
