import { getVaultData } from '@/app/server-handlers/vault-data'
import { PanelRoleAdmin } from '@/features/panels/vaults/components/PanelRoleAdmin/PanelRoleAdmin'

export default async function InstitutionVaultRoleAdminPage({
  params,
}: {
  params: Promise<{ institutionId: string; vaultId: string }>
}) {
  const { institutionId, vaultId } = await params
  const [{ vault }] = await Promise.all([getVaultData(institutionId, vaultId)])
  const selectedVault = vault

  return <PanelRoleAdmin roles={selectedVault.roles} />
}
