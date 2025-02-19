import { parseServerResponseToClient } from '@summerfi/app-utils'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { VaultListViewComponent } from '@/components/layout/VaultsListView/VaultListViewComponent'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

const EarnAllVaultsPage = async () => {
  const [{ vaults }, configRaw] = await Promise.all([getVaultsList(), systemConfigHandler()])
  const { config: systemConfig } = parseServerResponseToClient(configRaw)

  const vaultsWithConfig = decorateVaultsWithConfig({
    vaults,
    systemConfig,
  })

  return <VaultListViewComponent vaultsList={vaultsWithConfig} />
}

export default EarnAllVaultsPage
