import { type NetworkNames } from '@summerfi/app-types'
import { networkNameToSDKId } from '@summerfi/app-utils'

import { getInstitutionVaultActiveUsers } from '@/app/server-handlers/institution/institution-vaults'
import { getVaultWhitelist } from '@/app/server-handlers/sdk/get-vault-whitelist'
import { ClientSideSdkWrapper } from '@/components/organisms/ClientSideSDKWrapper/ClientSideSDKWrapper'
import { PanelUserAdmin } from '@/features/panels/vaults/components/PanelUserAdmin/PanelUserAdmin'

export default async function InstitutionVaultUserAdminPage({
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

  const [whitelistedWallets, activeUsers] = await Promise.all([
    getVaultWhitelist({
      institutionName,
      vaultAddress,
      chainId,
    }),
    getInstitutionVaultActiveUsers({
      vaultAddress,
      chainId,
    }),
  ])

  return (
    <ClientSideSdkWrapper>
      <PanelUserAdmin
        whitelistedWallets={whitelistedWallets}
        activeUsers={activeUsers}
        vaultAddress={vaultAddress}
        network={network}
        institutionName={institutionName}
      />
    </ClientSideSdkWrapper>
  )
}
