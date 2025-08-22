import { PanelClientAdmin } from '@/features/panels/vaults/components/PanelClientAdmin/PanelClientAdmin'
import { type VaultClientAdminUser } from '@/features/panels/vaults/components/PanelClientAdmin/types'

// TODO: replace with actual data
const getVaultClientAdminData = ({
  institutionId: _institutionId,
  vaultAddress: _vaultAddress,
  network: _network,
}: {
  institutionId: string
  vaultAddress: string
  network: string
}): {
  whitelistedUsers: VaultClientAdminUser[]
  revokedUsers: VaultClientAdminUser[]
} => {
  return {
    whitelistedUsers: [
      {
        name: 'Institution XYZ',
        address: '0x1234567890123456789012345678901234567890',
        access: 'Can edit',
        dateAddedOrRevoked: '01/01/2021',
        totalBalance: '1000',
      },
      {
        name: 'Company XYZ',
        address: '0x1234567890123456789012345678901234567890',
        access: 'Can view',
        dateAddedOrRevoked: '01/01/2021',
        totalBalance: '1000',
      },
      {
        name: 'John Kovalsky',
        address: '0x1234567890123456789012345678901234567890',
        access: 'Can view',
        dateAddedOrRevoked: '01/01/2021',
        totalBalance: '1000',
      },
    ],
    revokedUsers: [
      {
        name: 'Jane Doe',
        address: '0x1234567890123456789012345678901234567890',
        dateAddedOrRevoked: '01/01/2021',
        totalBalance: '1000',
      },
    ],
  }
}

export default async function InstitutionVaultClientAdminPage({
  params,
}: {
  params: Promise<{ institutionId: string; vaultAddress: string; network: string }>
}) {
  const { institutionId, vaultAddress, network } = await params

  const { whitelistedUsers, revokedUsers } = getVaultClientAdminData({
    institutionId,
    vaultAddress,
    network,
  })

  return <PanelClientAdmin whitelistedUsers={whitelistedUsers} revokedUsers={revokedUsers} />
}
