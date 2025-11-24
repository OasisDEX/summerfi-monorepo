import { humanNetworktoSDKNetwork } from '@summerfi/app-utils'

import { getInstitutionVaultFeeRevenueConfig } from '@/app/server-handlers/institution/institution-vault-fee-revenue-config'
import { getInstitutionVault } from '@/app/server-handlers/institution/institution-vaults'
import { PanelFeeRevenueAdmin } from '@/features/panels/vaults/components/PanelFeeRevenueAdmin/PanelFeeRevenueAdmin'

export default async function InstitutionVaultFeeRevenueAdminPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: string }>
}) {
  const { institutionName, vaultAddress, network } = await params
  const [institutionVault, institutionVaultFeeRevenueConfig] = await Promise.all([
    getInstitutionVault({
      institutionName,
      network: humanNetworktoSDKNetwork(network),
      vaultAddress,
    }),
    getInstitutionVaultFeeRevenueConfig({
      institutionName,
      network: humanNetworktoSDKNetwork(network),
      vaultAddress,
    }),
  ])

  if (!institutionVault?.vault) {
    return <div>Vault not found</div>
  }

  return (
    <PanelFeeRevenueAdmin
      vaultData={institutionVault.vault}
      vaultFeeAmount={
        Number(institutionVaultFeeRevenueConfig?.vaultFeeAmount.value.toString() ?? '0') / 100
      }
    />
  )
}
