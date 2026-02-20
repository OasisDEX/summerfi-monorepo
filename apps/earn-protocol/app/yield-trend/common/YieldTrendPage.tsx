import { type FC } from 'react'
import { getArksInterestRates, getVaultsHistoricalApy } from '@summerfi/app-server-handlers'
import {
  parseServerResponseToClient,
  subgraphNetworkToId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedIsVaultDaoManaged } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultsApy } from '@/app/server-handlers/cached/get-vaults-apy'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
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
  const [{ vaults }, configRaw] = await Promise.all([getCachedVaultsList(), getCachedConfig()])

  const systemConfig = parseServerResponseToClient(configRaw)

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

  const vaultsWithConfig = decorateVaultsWithConfig({
    systemConfig,
    vaults,
    daoManagedVaultsList,
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

  const [fullArkInterestRatesMap, vaultInterestRates, vaultsApyByNetworkMap] = await Promise.all([
    getArksInterestRates({
      network: parsedNetwork,
      arksList: selectedVault.arks.filter(
        (ark): boolean => Number(ark.depositCap) > 0 || Number(ark.inputTokenBalance) > 0,
      ),
    }),
    getVaultsHistoricalApy({
      // just the vault displayed
      fleets: [selectedVault].map(({ id, protocol: { network: protocolNetwork } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(protocolNetwork)),
      })),
    }),
    getCachedVaultsApy({
      fleets: vaultsWithConfig.map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
      })),
    }),
  ])

  const arksHistoricalChartData = getArkHistoricalChartData({
    vault: selectedVault,
    arkInterestRatesMap: fullArkInterestRatesMap,
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
