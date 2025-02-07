import { parseServerResponseToClient } from '@summerfi/app-utils'
import { redirect } from 'next/navigation'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { VaultListViewComponent } from '@/components/layout/VaultsListView/VaultListViewComponent'
import { isPreLaunchVersion } from '@/constants/is-pre-launch-version'
import { decorateCustomVaultFields } from '@/helpers/vault-custom-value-helpers'

const EarnAllVaultsPage = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (isPreLaunchVersion) {
    return redirect('/sumr')
  }
  const [{ vaults }, configRaw] = await Promise.all([getVaultsList(), systemConfigHandler()])
  const { config: systemConfig } = parseServerResponseToClient(configRaw)
  const vaultsDecorated = decorateCustomVaultFields({ vaults, systemConfig })

  return <VaultListViewComponent vaultsList={vaultsDecorated} />
}

export default EarnAllVaultsPage
