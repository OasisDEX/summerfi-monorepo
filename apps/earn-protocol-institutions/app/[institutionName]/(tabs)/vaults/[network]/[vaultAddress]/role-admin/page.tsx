import { type NetworkNames } from '@summerfi/app-types'
import { networkNameToSDKId } from '@summerfi/app-utils'

import { getVaultSpecificRoles } from '@/app/server-handlers/sdk/get-vault-roles'
import { PanelRoleAdmin } from '@/features/panels/vaults/components/PanelRoleAdmin/PanelRoleAdmin'

export default async function InstitutionVaultRoleAdminPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: NetworkNames }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const chainId = networkNameToSDKId(network)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!chainId) {
    throw new Error(`Unsupported network: ${network}`)
  }

  const rolesList = await getVaultSpecificRoles({
    institutionName,
    vaultAddress,
    chainId,
  })

  console.log('rolesList', rolesList)

  return <PanelRoleAdmin roles={rolesList} />
}
