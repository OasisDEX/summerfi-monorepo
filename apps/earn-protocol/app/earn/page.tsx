import { parseServerResponseToClient } from '@summerfi/app-utils'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { VaultManageViewComponent } from '@/components/layout/VaultsListView/VaultListViewComponent'
import { decorateCustomVaultFields } from '@/helpers/vault-custom-value-helpers'

export const revalidate = 60

const EarnAllVaultsPage = async () => {
  const [{ vaults }, configRaw] = await Promise.all([getVaultsList(), systemConfigHandler()])
  const { config: systemConfig } = parseServerResponseToClient(configRaw)
  const vaultsDecorated = decorateCustomVaultFields({ vaults, systemConfig })

  return <VaultManageViewComponent vaultsList={vaultsDecorated} />
}

export default EarnAllVaultsPage
