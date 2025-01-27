import { parseServerResponseToClient } from '@summerfi/app-utils'
import { redirect } from 'next/navigation'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import { VaultListViewComponent } from '@/components/layout/VaultsListView/VaultListViewComponent'
import { isFullyLaunched } from '@/constants/is-fully-launched'
import { decorateCustomVaultFields } from '@/helpers/vault-custom-value-helpers'

export const dynamic = 'force-static'
export const revalidate = 60

const EarnAllVaultsPage = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!isFullyLaunched) {
    return redirect('/sumr')
  }
  const [{ vaults }, configRaw] = await Promise.all([getVaultsList(), systemConfigHandler()])
  const { config: systemConfig } = parseServerResponseToClient(configRaw)
  const vaultsDecorated = decorateCustomVaultFields({ vaults, systemConfig })

  return <VaultListViewComponent vaultsList={vaultsDecorated} />
}

export default EarnAllVaultsPage
