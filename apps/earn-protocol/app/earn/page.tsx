import { parseServerResponseToClient } from '@summerfi/app-utils'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { VaultManageViewComponent } from '@/components/layout/VaultsListView/VaultListViewComponent'
import { decorateCustomVaultFields } from '@/helpers/vault-custom-value-helpers'

export const revalidate = 60

const EarnAllVaultsPage = async () => {
  const { vaults } = await getVaultsList()
  const { config } = parseServerResponseToClient(await systemConfigHandler())
  const vaultsDecorated = decorateCustomVaultFields(vaults, config)

  return <VaultManageViewComponent vaultsList={vaultsDecorated} />
}

export default EarnAllVaultsPage
