import { getInstitutionData } from '@/app/server-handlers/institution-data'
import { PanelFeeRevenueAdmin } from '@/features/panels/vaults/components/PanelFeeRevenueAdmin/PanelFeeRevenueAdmin'

export default async function InstitutionVaultFeeRevenueAdminPage({
  params,
}: {
  params: Promise<{ institutionId: string; vaultId: string }>
}) {
  const { institutionId, vaultId } = await params
  const institutionData = await getInstitutionData(institutionId)

  const vaultData = institutionData.vaultsData.find((vault) => vault.id === vaultId)

  if (!vaultData) {
    return <div>Vault not found</div>
  }

  return <PanelFeeRevenueAdmin vaultData={vaultData} />
}
