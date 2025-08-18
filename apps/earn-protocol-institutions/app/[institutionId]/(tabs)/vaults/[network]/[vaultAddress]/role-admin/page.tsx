import { GeneralRoles } from '@summerfi/sdk-client'

import { PanelRoleAdmin } from '@/features/panels/vaults/components/PanelRoleAdmin/PanelRoleAdmin'

export default async function InstitutionVaultRoleAdminPage({
  params,
}: {
  params: Promise<{ institutionId: string; vaultAddress: string; network: string }>
}) {
  const { institutionId, network, vaultAddress } = await params

  // eslint-disable-next-line no-console
  console.log({
    institutionId,
    network,
    vaultAddress,
  })

  // get roles here

  return (
    <PanelRoleAdmin
      roles={{
        [GeneralRoles.ADMIRALS_QUARTERS_ROLE]: {
          address: '0x1234567890abcdef1234567890abcdef12345678',
          lastUpdated: Date.now(),
        },
      }}
    />
  )
}
