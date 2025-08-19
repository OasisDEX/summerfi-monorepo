import { humanNetworktoSDKNetwork } from '@summerfi/app-utils'

import { getInstitutionVault } from '@/app/server-handlers/institution-vaults'
import { PanelFeeRevenueAdmin } from '@/features/panels/vaults/components/PanelFeeRevenueAdmin/PanelFeeRevenueAdmin'

export default async function InstitutionVaultFeeRevenueAdminPage({
  params,
}: {
  params: Promise<{ institutionId: string; vaultAddress: string; network: string }>
}) {
  const { institutionId, vaultAddress, network } = await params
  const [institutionVault] = await Promise.all([
    getInstitutionVault({
      institutionId,
      network: humanNetworktoSDKNetwork(network),
      vaultAddress,
    }),
  ])

  if (!institutionVault?.vault) {
    return <div>Vault not found</div>
  }

  return <PanelFeeRevenueAdmin vaultData={institutionVault.vault} />
}
