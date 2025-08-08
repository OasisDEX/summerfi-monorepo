import { getArksInterestRates, getVaultsApy } from '@summerfi/app-server-handlers'
import { SupportedSDKNetworks } from '@summerfi/app-types'
import {
  decorateWithFleetConfig,
  subgraphNetworkToId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'

import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { PanelVaultExposure } from '@/features/panels/vaults/components/PanelVaultExposure/PanelVaultExposure'

export default async function InstitutionVaultVaultExposurePage() {
  // dummy for now as well as vault address
  const parsedNetwork = SupportedSDKNetworks.Base

  const [vault, { config: systemConfig }] = await Promise.all([
    getVaultDetails({
      institutionID: 'test-client',
      vaultAddress: '0x2bb9ad69feba5547b7cd57aafe8457d40bf834af',
      network: parsedNetwork,
    }),
    systemConfigHandler(),
  ])

  if (!vault) {
    return <div>Vault not found</div>
  }

  const vaultWithConfig = decorateWithFleetConfig([vault], systemConfig)

  const [arkInterestRates, vaultsApyRaw] = await Promise.all([
    vault.arks
      ? getArksInterestRates({
          network: parsedNetwork,
          arksList: vault.arks,
        })
      : Promise.resolve({}),
    getVaultsApy({
      fleets: vaultWithConfig.map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
      })),
    }),
  ])

  const vaultApyData =
    vaultsApyRaw[`${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`]

  return (
    <PanelVaultExposure
      vault={vault}
      arkInterestRates={arkInterestRates}
      vaultApyData={vaultApyData}
    />
  )
}
