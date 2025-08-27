import { humanNetworktoSDKNetwork } from '@summerfi/app-utils'

import { getInstitutionVault } from '@/app/server-handlers/institution-vaults'
import { PanelFeeRevenueAdmin } from '@/features/panels/vaults/components/PanelFeeRevenueAdmin/PanelFeeRevenueAdmin'

const dummyThirdPartyCosts = [
  {
    type: 'Summer.fi Fee',
    fee: 0.001,
    address: '0x1234567890123456789012345678901234567890',
  },
  {
    type: '3rd Party Risk Manager',
    fee: 0.001,
    address: '0x1234567890123456789012345678901234567890',
  },
]

const dummyFeeRevenueHistory = [
  { monthYear: 'January 2025', income: 100, expense: 123, revenue: 100 },
  { monthYear: 'February 2025', income: 100, expense: 123, revenue: 100 },
  { monthYear: 'March 2025', income: 100, expense: 123, revenue: 100 },
]

const dummyFeeRevenue = [{ name: 'Vult AUM Fee', aumFee: 0.001 }]

const getVaultFeeRevenueData = async () => {
  return {
    thirdPartyCosts: dummyThirdPartyCosts,
    feeRevenueHistory: dummyFeeRevenueHistory,
    feeRevenue: dummyFeeRevenue,
  }
}

export default async function InstitutionVaultFeeRevenueAdminPage({
  params,
}: {
  params: Promise<{ institutionId: string; vaultAddress: string; network: string }>
}) {
  const { institutionId, vaultAddress, network } = await params
  const [institutionVault, vaultFeeRevenueData] = await Promise.all([
    getInstitutionVault({
      institutionId,
      network: humanNetworktoSDKNetwork(network),
      vaultAddress,
    }),
    getVaultFeeRevenueData(),
  ])

  if (!institutionVault?.vault) {
    return <div>Vault not found</div>
  }

  return (
    <PanelFeeRevenueAdmin vaultData={institutionVault.vault} feeRevenueData={vaultFeeRevenueData} />
  )
}
