import { parseServerResponseToClient, subgraphNetworkToId } from '@summerfi/app-utils'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { getVaultsApy } from '@/app/server-handlers/vaults-apy'
import { VaultListViewComponent } from '@/components/layout/VaultsListView/VaultListViewComponent'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

const EarnAllVaultsPage = async () => {
  const [{ vaults }, configRaw] = await Promise.all([getVaultsList(), systemConfigHandler()])
  const { config: systemConfig } = parseServerResponseToClient(configRaw)

  const vaultsWithConfig = decorateVaultsWithConfig({
    vaults,
    systemConfig,
  })

  const vaultsApyByNetworkMap = await getVaultsApy({
    fleets: vaultsWithConfig.map(({ id, protocol: { network } }) => ({
      fleetAddress: id,
      chainId: subgraphNetworkToId(network),
    })),
  })

  return (
    <VaultListViewComponent
      vaultsList={vaultsWithConfig}
      vaultsApyByNetworkMap={vaultsApyByNetworkMap}
    />
  )
}

export default EarnAllVaultsPage
